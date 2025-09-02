import React from 'react';
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, Lock, Users, FileText, Mail } from "lucide-react";

const PrivacyPolicy = () => {
  const lastUpdated = "January 1, 2025";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
            <p className="text-lg text-muted-foreground">
              Your privacy and data protection are our top priorities
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Last updated: {lastUpdated}
            </p>
          </div>

          {/* Overview */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This Privacy Policy describes how Daxa ("we," "our," or "us") collects, uses, and protects 
                your information when you use our Partner Deal Registration System. We are committed to 
                protecting your privacy and ensuring the security of your personal and business information.
              </p>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-green-600" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Personal Information</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Name and email address (via Google OAuth)</li>
                  <li>Company name and contact information</li>
                  <li>Professional profile information</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Deal Registration Data</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Customer company information</li>
                  <li>Deal value and contract details</li>
                  <li>Territory and industry information</li>
                  <li>Deal stage and timeline information</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Technical Information</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>IP address and browser information</li>
                  <li>Usage analytics and system logs</li>
                  <li>Authentication tokens and session data</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Information */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong>Deal Processing:</strong> To process and manage partner deal registrations</li>
                <li><strong>Duplicate Prevention:</strong> To identify and prevent duplicate deal submissions</li>
                <li><strong>Communication:</strong> To send notifications about deal status and system updates</li>
                <li><strong>Authentication:</strong> To verify your identity and maintain secure access</li>
                <li><strong>Analytics:</strong> To improve our platform performance and user experience</li>
                <li><strong>Compliance:</strong> To meet legal and regulatory requirements</li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Protection */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-red-600" />
                Data Protection & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Security Measures</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>End-to-end encryption for data transmission</li>
                  <li>Secure authentication via Google OAuth 2.0</li>
                  <li>Regular security audits and monitoring</li>
                  <li>Access controls and role-based permissions</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Data Storage</h3>
                <p className="text-muted-foreground">
                  Your data is stored securely using industry-standard encryption. Deal registration 
                  data is stored in Google Sheets with appropriate access controls. We retain your 
                  information only as long as necessary for business purposes and legal requirements.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Data Sharing */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-600" />
                Data Sharing & Third Parties
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties, 
                except in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong>Service Providers:</strong> Google (for authentication and data storage)</li>
                <li><strong>Legal Requirements:</strong> When required by law or legal process</li>
                <li><strong>Business Transfer:</strong> In case of merger, acquisition, or sale of assets</li>
                <li><strong>Consent:</strong> When you explicitly consent to sharing</li>
              </ul>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Your Rights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">You have the following rights regarding your personal information:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong>Access:</strong> Request access to your personal data</li>
                <li><strong>Correction:</strong> Request correction of inaccurate data</li>
                <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                <li><strong>Portability:</strong> Request transfer of your data</li>
                <li><strong>Objection:</strong> Object to processing of your data</li>
                <li><strong>Restriction:</strong> Request restriction of data processing</li>
              </ul>
            </CardContent>
          </Card>

          {/* Cookies */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-600" />
                Cookies & Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                We use essential cookies and local storage to provide our services:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Authentication tokens for secure login</li>
                <li>Session management and user preferences</li>
                <li>Form data preservation during registration</li>
                <li>Basic analytics for system performance</li>
              </ul>
            </CardContent>
          </Card>

          {/* Updates */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                Policy Updates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time. We will notify you of any material 
                changes by posting the new Privacy Policy on this page and updating the "Last updated" date. 
                Your continued use of our service after any changes indicates your acceptance of the updated policy.
              </p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-600" />
                Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                If you have any questions about this Privacy Policy or wish to exercise your rights, 
                please contact us:
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <p className="font-semibold">Daxa Privacy Team</p>
                <p className="text-muted-foreground">Email: privacy@daxa.ai</p>
                <p className="text-muted-foreground">Website: https://daxa.ai/contact-us</p>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2025 Daxa. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;