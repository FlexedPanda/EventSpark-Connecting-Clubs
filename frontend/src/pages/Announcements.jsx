import React, { useState, useEffect } from "react";
import { LoaderCircle, UserRound, Calendar1 } from "lucide-react";
import {
	Card,
	CardHeader,
	CardContent,
	CardFooter,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { toast } from "react-hot-toast";

import useAxios from "../hooks/useAxios.jsx";
import { Separator } from "@/components/ui/separator.jsx";

export default function Announcement() {
	const { get } = useAxios();
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchPosts = async () => {
			setLoading(true);
			try {
				const data = await get("/api/user/posts");
				setPosts(data.posts);
			} catch (error) {
				toast.error(
					error.data.message || "Fetch Failed"
				);
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		fetchPosts();
	}, []);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-[600px]">
				<div className="animate-spin text-primary">
					<LoaderCircle
						size={64}
						strokeWidth={1}
					/>
				</div>
			</div>
		);
	}

	if (!posts.length) {
		return (
			<div className="h-[90vh] flex items-center justify-center p-6">
				<Card className="transition-transform transform hover:scale-125 shadow-md hover:shadow-lg rounded-3xl">
					<CardHeader className="text-center text-2xl font-bold text-primary">
						Announcements
					</CardHeader>
					<CardContent className="w-5/1 space-y-4 rounded-lg shadow-lg text-center text-primary-foreground">
						Could Not Find Any Announcements
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="min-h-[90vh] p-6 bg-background">
			<h1 className="text-center text-4xl font-bold tracking-tight text-primary mb-8">
				Announcements
			</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{posts.map((post) => (
					<Card
						key={post._id}
						className="transition-transform transform hover:scale-95 shadow-md hover:shadow-lg rounded-3xl">
						<CardHeader>
							<CardTitle>
								<h2 className="text-xl font-bold text-primary text-center">{post.title}</h2>
							</CardTitle>
							<CardDescription>
								<div className="flex justify-center items-center gap-2">
									<Calendar1 className="h-5 w-5 text-primary" />
									<p>
										<b className="text-primary">Event : </b>
										<b> {post.event.title}</b>
									</p>
								</div>
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-2 py-2">
							<p className="px-4">{post.content}</p>
							<Separator className="bg-primary"/>
							<div className="flex justify-end items-end">
								<p className="text-sm text-muted-foreground">
									Posted At : {new Date(post.createdAt).toLocaleDateString("en-UK")}
								</p>
							</div>
						</CardContent>
						<CardFooter className="pt-0">
							<div className="flex flex-col">
								<div className="flex items-start gap-2">
									<UserRound className="text-primary w-5 h-7" />
									<div>
										<p className="font-bold text-primary">Posted By:</p>
										<p className="text-primary-foreground font-semibold">
											{post.author.name}
										</p>
										<p className="text-muted-foreground">
											{`${post.author.designation}, ${post.club.name}`}
										</p>
									</div>
								</div>
							</div>
						</CardFooter>
					</Card>
				))}
			</div>
		</div>
	);
}
