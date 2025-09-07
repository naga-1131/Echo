 "use client";

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ThumbsDown, ThumbsUp, Loader2 } from "lucide-react";
import { moderateContentAction } from '@/app/actions';

const initialState = {
    flagged: null,
    reason: '',
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Moderate Content
        </Button>
    );
}

export default function ContentModerationTool() {
    const [state, formAction] = useFormState(moderateContentAction, initialState);

    return (
        <Card>
            <CardHeader>
                <CardTitle>AI Content Moderator</CardTitle>
                <CardDescription>
                    Review user-generated content for violations of environmental community guidelines.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="text">Post Text</Label>
                        <Textarea id="text" name="text" placeholder="Enter post text here..." required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="mediaUrl">Media URL (Optional)</Label>
                        <Input id="mediaUrl" name="mediaUrl" placeholder="https://example.com/image.jpg" />
                    </div>
                    <SubmitButton />
                </form>

                {state.flagged !== null && (
                     <Alert className="mt-6" variant={state.flagged ? "destructive" : "default"}>
                        {state.flagged ? <ThumbsDown className="h-4 w-4" /> : <ThumbsUp className="h-4 w-4" />}
                        <AlertTitle>
                            {state.flagged ? 'Content Flagged' : 'Content Approved'}
                        </AlertTitle>
                        <AlertDescription>
                            {state.reason || (state.flagged ? "This content violates community guidelines." : "This content seems compliant with community guidelines.")}
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    );
}
