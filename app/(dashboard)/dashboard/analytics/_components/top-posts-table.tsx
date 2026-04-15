"use strict";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Post {
    id: string;
    content: string;
    platforms: string[];
    status: string;
    publishedAt: string | Date | null;
    createdAt: string | Date;
}

interface TopPostsTableProps {
    posts: Post[];
}

export function TopPostsTable({ posts }: TopPostsTableProps) {
    if (posts.length === 0) {
        return (
            <div className="text-center py-10 text-muted-foreground">
                No published posts found in this period.
            </div>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Content</TableHead>
                        <TableHead>Platforms</TableHead>
                        <TableHead>Published At</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {posts.map((post) => (
                        <TableRow key={post.id}>
                            <TableCell className="font-medium max-w-75 truncate">
                                {post.content}
                            </TableCell>
                            <TableCell>
                                <div className="flex gap-1">
                                    {(post.platforms as string[]).map((p) => (
                                        <Badge key={p} variant="secondary" className="capitalize">
                                            {p}
                                        </Badge>
                                    ))}
                                </div>
                            </TableCell>
                            <TableCell>
                                {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                                <Badge variant={post.status === "published" ? "default" : "secondary"}>
                                    {post.status}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
