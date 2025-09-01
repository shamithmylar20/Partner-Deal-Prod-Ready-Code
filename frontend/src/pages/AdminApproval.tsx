import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Clock, Building2, DollarSign, Calendar, User, Mail, MapPin, UserPlus, Shield, Trash2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { useAuth } from "@/contexts/AuthContext";
import apiClient from "@/services/apiClient";

interface Deal {
  id: string;
  status: string;
  created_at: string;
  company_name: string;
  domain: string;
  partner_company: string;
  submitter_name: string;
  submitter_email: string;
  territory: string;
  customer_industry: string;
  customer_location: string;
  deal_stage: string;
  expected_close_date: string;
  deal_value: string;
  contract_type: string;
  primary_product: string;
  additional_notes: string;
  customer_legal_name: string;
  approved_by?: string;
  approved_at?: string;
  rejection_reason?: string;
}

interface AdminUser {
  email: string;
  added_by: string;
  added_at: string;
  status: string;
}

const AdminApproval = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingDeal, setProcessingDeal] = useState<string | null>(null);
  
  // Admin Management State
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [isViewAdminsOpen, setIsViewAdminsOpen] = useState(false);
  const [addingAdmin, setAddingAdmin] = useState(false);
  const [adminList, setAdminList] = useState<AdminUser[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');

  // Check if current user is an approver (either by email OR by role)
  const approvers = ['huseini@daxa.ai', 'apoorva@daxa.ai', 'sridhar@daxa.ai', 'admin@daxa.ai'];
  const isApprover = user && (
    approvers.includes(user.email.toLowerCase()) || 
    user.role === 'admin'
  );

  useEffect(() => {
    if (isApprover) {
      loadPendingDeals();
    }
  }, [isApprover]);

  const loadPendingDeals = async () => {
    try {
      setLoading(true);
      const data = await apiClient.request('/admin/pending-deals');
      setDeals(data.deals || []);
    } catch (error) {
      console.error('Error loading deals:', error);
      toast({
        title: "Error",
        description: "Failed to load pending deals",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAdminList = async () => {
    try {
      setLoadingAdmins(true);
      const data = await apiClient.request('/admin/list');
      setAdminList(data.admins || []);
    } catch (error) {
      console.error('Error loading admin list:', error);
      toast({
        title: "Error",
        description: "Failed to load admin list",
        variant: "destructive"
      });
    } finally {
      setLoadingAdmins(false);
    }
  };

  const handleAddAdmin = async () => {
    if (!newAdminEmail.trim()) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newAdminEmail.trim())) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    try {
      setAddingAdmin(true);
      await apiClient.request('/admin/add', {
        method: 'POST',
        body: JSON.stringify({
          email: newAdminEmail.trim(),
          added_by: user?.email
        })
      });

      toast({
        title: "Admin Added",
        description: `${newAdminEmail} has been added as an admin`,
      });
      
      setNewAdminEmail('');
      setIsAddAdminOpen(false);
      loadAdminList(); // Refresh the admin list
    } catch (error) {
      console.error('Error adding admin:', error);
      toast({
        title: "Error",
        description: "Failed to add admin",
        variant: "destructive"
      });
    } finally {
      setAddingAdmin(false);
    }
  };

  const handleRemoveAdmin = async (email: string) => {
    if (email === user?.email) {
      toast({
        title: "Cannot Remove Self",
        description: "You cannot remove yourself as an admin",
        variant: "destructive"
      });
      return;
    }

    try {
      await apiClient.request('/admin/remove', {
        method: 'POST',
        body: JSON.stringify({
          email: email,
          removed_by: user?.email
        })
      });

      toast({
        title: "Admin Removed",
        description: `${email} has been removed as an admin`,
      });
      
      loadAdminList(); // Refresh the admin list
    } catch (error) {
      console.error('Error removing admin:', error);
      toast({
        title: "Error",
        description: "Failed to remove admin",
        variant: "destructive"
      });
    }
  };

  const handleDealAction = async (dealId: string, action: 'approve' | 'reject', reason?: string) => {
    try {
      setProcessingDeal(dealId);
      
      await apiClient.request(`/admin/deals/${dealId}/${action}`, {
        method: 'POST',
        body: JSON.stringify({
          approver_name: user?.firstName + ' ' + user?.lastName,
          rejection_reason: reason
        })
      });

      toast({
        title: action === 'approve' ? "Deal Approved" : "Deal Rejected",
        description: `Deal has been ${action}d successfully`,
      });
      
      // Reload deals
      loadPendingDeals();
    } catch (error) {
      console.error(`Error ${action}ing deal:`, error);
      toast({
        title: "Error",
        description: `Failed to ${action} deal`,
        variant: "destructive"
      });
    } finally {
      setProcessingDeal(null);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (value: string) => {
    if (!value) return 'N/A';
    const num = parseFloat(value.toString().replace(/[^0-9.-]+/g, ''));
    if (isNaN(num)) return value;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  if (!isApprover) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Access Denied</h1>
            <p className="text-muted-foreground">You don't have permission to access the approval dashboard.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Deal Approval Dashboard</h1>
            <p className="text-muted-foreground">Review and approve pending deal registrations</p>
          </div>
          
          {/* Admin Management Buttons */}
          <div className="flex gap-2">
            {/* View Admin List */}
            <Dialog open={isViewAdminsOpen} onOpenChange={setIsViewAdminsOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" onClick={loadAdminList}>
                  <Shield className="w-4 h-4 mr-2" />
                  View Admins
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Current Administrators</DialogTitle>
                  <DialogDescription>
                    Users with admin privileges in the system
                  </DialogDescription>
                </DialogHeader>
                
                <div className="max-h-60 overflow-y-auto">
                  {loadingAdmins ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                    </div>
                  ) : adminList.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">No admins found</p>
                  ) : (
                    <div className="space-y-2">
                      {adminList.map((admin, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <div>
                            <p className="font-medium">{admin.email}</p>
                            <p className="text-xs text-muted-foreground">
                              Added by {admin.added_by} on {formatDate(admin.added_at)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={admin.status === 'active' ? 'default' : 'secondary'}>
                              {admin.status}
                            </Badge>
                            {admin.email !== user?.email && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleRemoveAdmin(admin.email)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            {/* Add Admin Button */}
            <Dialog open={isAddAdminOpen} onOpenChange={setIsAddAdminOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Admin
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Administrator</DialogTitle>
                  <DialogDescription>
                    Grant admin privileges to a user by their email address.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="admin-email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="user@company.com"
                      className="col-span-3"
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleAddAdmin}
                    disabled={addingAdmin || !newAdminEmail.trim()}
                  >
                    {addingAdmin ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Adding...
                      </>
                    ) : (
                      'Add Admin'
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Deals List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading deals...</p>
          </div>
        ) : deals.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No pending deals</h3>
              <p className="text-muted-foreground">All deals have been reviewed.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {deals.map((deal) => (
              <DealCard
                key={deal.id}
                deal={deal}
                onApprove={() => handleDealAction(deal.id, 'approve')}
                onReject={(reason) => handleDealAction(deal.id, 'reject', reason)}
                processing={processingDeal === deal.id}
                formatDate={formatDate}
                formatCurrency={formatCurrency}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Separate DealCard component for better organization
const DealCard = ({ deal, onApprove, onReject, processing, formatDate, formatCurrency }: any) => {
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleReject = () => {
    if (showRejectReason && rejectionReason.trim()) {
      onReject(rejectionReason);
      setShowRejectReason(false);
      setRejectionReason('');
    } else {
      setShowRejectReason(true);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{deal.company_name}</CardTitle>
            <CardDescription>{deal.customer_legal_name}</CardDescription>
          </div>
          <div className="text-right">
            <Badge variant={
              deal.status === 'approved' ? 'default' : 
              deal.status === 'rejected' ? 'destructive' : 
              'secondary'
            }>
              {deal.status}
            </Badge>
            <p className="text-sm text-muted-foreground mt-1">
              Submitted {formatDate(deal.created_at)}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Submitter Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Submitted By</p>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span>{deal.submitter_name}</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Partner</p>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              <span>{deal.partner_company}</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Email</p>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span>{deal.submitter_email}</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Territory</p>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span>{deal.territory}</span>
            </div>
          </div>
        </div>

        {/* Deal Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Industry</p>
            <span>{deal.customer_industry}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Location</p>
            <span>{deal.customer_location}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Deal Stage</p>
            <Badge variant="outline">{deal.deal_stage}</Badge>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Deal Value</p>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span className="font-semibold">{formatCurrency(deal.deal_value)}</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Expected Close</p>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>{formatDate(deal.expected_close_date)}</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Contract Type</p>
            <Badge variant="outline">{deal.contract_type}</Badge>
          </div>
        </div>

        {/* Additional Notes */}
        {deal.additional_notes && (
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Additional Notes</p>
            <p className="text-sm bg-muted p-3 rounded-md">{deal.additional_notes}</p>
          </div>
        )}

        {/* Rejection Reason Input */}
        {showRejectReason && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Rejection Reason</p>
            <Textarea
              placeholder="Please provide a reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={3}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <Button
            onClick={() => onApprove()}
            disabled={processing}
            className="flex-1"
          >
            {processing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve Deal
              </>
            )}
          </Button>
          
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={processing || (showRejectReason && !rejectionReason.trim())}
            className="flex-1"
          >
            <XCircle className="w-4 h-4 mr-2" />
            {showRejectReason ? 'Confirm Rejection' : 'Reject Deal'}
          </Button>

          {showRejectReason && (
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectReason(false);
                setRejectionReason('');
              }}
            >
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminApproval;