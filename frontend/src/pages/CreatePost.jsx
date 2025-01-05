import React, { useState, useEffect } from "react";
import {
	ScrollText,
	SquarePen,
	PenOff,
	PenLine,
	LoaderCircle,
} from "lucide-react";
import {
	Card,
	CardHeader,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea.jsx";
import useAxios from "../hooks/useAxios.jsx";

export default function CreatePost() {
	const formData = {
		title: "",
		content: "",
	};
	const { get, post } = useAxios();
	const [loading, setLoading] = useState(true);
	const [disabled, setDisabled] = useState(false);
	const [form, setForm] = useState(formData);
	const [reload, setReload] = useState(false);

	useEffect(() => {
		const fetchPosts = async () => {
			setLoading(true);
			try {
				const data = await get("/api/user/check");
				if (data.posts >= 3) {
					setDisabled(true);
				} else {
					setDisabled(false);
				}
				console.log(data);
			} catch (error) {
				setDisabled(true);
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		fetchPosts();
	}, [reload]);

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

	const handleChange = (e) => {
		setForm({
			...form,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const data = await post("/api/user/post", form);
			toast.success(data.message || "Post Created");
			setForm(formData);
			setReload((prev) => !prev);
		} catch (error) {
			toast.error(error?.response?.data?.message || "Post Failed");
			console.error(error);
		}
	};

	return (
		<div className="h-[90vh] flex items-center justify-center p-6">
			<Card className="w-4/12 rounded-3xl shadow-lg space-y-4">
				<form onSubmit={handleSubmit}>
					<CardHeader className="text-center text-primary">
						<h1 className="text-4xl font-bold tracking-tighter">Create Post</h1>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<div className="relative">
								<SquarePen className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-foreground h-5 w-5" />
								<Input
									type="text"
									name="title"
									disabled={disabled}
									value={form.title}
									onChange={handleChange}
									placeholder="Post Title"
									className="w-full pl-10 pr-4 py-2 border rounded bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
									required
								/>
							</div>
						</div>
						<div className="space-y-2">
							<div className="relative">
								<ScrollText className="absolute left-3 top-2 text-primary-foreground h-5 w-5" />
								<Textarea
									type="text"
									name="content"
									disabled={disabled}
									value={form.content}
									onChange={handleChange}
									placeholder="Post Content"
									className="w-full pl-10 pr-4 py-2 border rounded bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
									required
								/>
							</div>
						</div>
					</CardContent>
					<CardFooter className="space-y-0">
						<Button
							type="submit"
							disabled={disabled}
							className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground p-2 rounded">
							{disabled ? (
								<span className="flex items-center gap-2">
									Post Disabled <PenOff />
								</span>
							) : (
								<span className="flex items-center gap-2">
									Create Post <PenLine />
								</span>
							)}
						</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
