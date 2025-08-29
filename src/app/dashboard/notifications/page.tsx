'use client';
import { useEffect, useState } from 'react';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { Notification } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { ColumnDef, DataTable } from '@/components/common/DataTables';
import { PageHeader } from '@/components/common/PageHeader';

const columns: ColumnDef<Notification>[] = [
    { accessorKey: 'title', header: 'Title', cell: (row) => <div className="font-medium">{row.title}</div> },
    { accessorKey: 'body', header: 'Message', cell: (row) => <p className="truncate max-w-xs">{row.body}</p> },
    { accessorKey: 'status', header: 'Status', cell: (row) => row.status },
    { accessorKey: 'sentTime', header: 'Sent At', cell: (row) => row.sentTime ? new Date(row.sentTime).toLocaleString() : 'N/A' },
];

export default function NotificationsPage() {
    const { notifications, loading, fetchNotifications, sendNotification } = useNotificationStore();
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    useEffect(() => {
        if (notifications.length === 0) fetchNotifications();
    }, [notifications, fetchNotifications]);

    const handleSend = async () => {
        if (!title || !body) {
            alert('Title and message are required.');
            return;
        }
        await sendNotification({ title, body, targetGroup: 'All' });
        setTitle('');
        setBody('');
    };

    return (
        <div className="space-y-6">
            <PageHeader title="Push Notifications" />
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Send New Notification</CardTitle>
                        <CardDescription>Send a message to all app users.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Weekly Motivation" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="body">Message</Label>
                            <Textarea id="body" value={body} onChange={(e) => setBody(e.target.value)} placeholder="Your message here..." />
                        </div>
                        <Button onClick={handleSend} disabled={loading}>
                            <Send className="mr-2 h-4 w-4" />
                            {loading ? 'Sending...' : 'Send to All Users'}
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>History</CardTitle>
                        <CardDescription>Recently sent notifications.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns}
                            data={notifications}
                            searchKey="title"
                            isLoading={loading}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
