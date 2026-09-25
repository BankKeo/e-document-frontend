"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChangePasswordForm } from "./change-password-form";
import { SessionsPanel } from "./sessions-panel";
import { MfaPanel } from "./mfa-panel";

export function SecurityPage() {
  return (
    <Tabs defaultValue="password" className="w-full">
      <TabsList variant="line" className="w-full">
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="sessions">Sessions</TabsTrigger>
        <TabsTrigger value="mfa">Two-factor</TabsTrigger>
      </TabsList>

      <TabsContent value="password" className="pt-4">
        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle>Change password</CardTitle>
            <CardDescription>
              Use a strong password you don&apos;t use anywhere else.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChangePasswordForm />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="sessions" className="pt-4">
        <SessionsPanel />
      </TabsContent>

      <TabsContent value="mfa" className="pt-4">
        <MfaPanel />
      </TabsContent>
    </Tabs>
  );
}