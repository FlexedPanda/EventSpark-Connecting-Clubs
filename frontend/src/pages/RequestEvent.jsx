import {
	Album,
	ScrollText,
	MapPinned,
	CalendarFold,
	CircleFadingPlus,
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
import React, { useState, useEffect } from "react";

import useAxios from "../hooks/useAxios.jsx";

export default function RequestEvent() {
	const formData = {
		title: "",
		description: "",
		venue: "",
		date: "",
	};
	const { get, post } = useAxios();
	const [loading, setLoading] = useState(true);
	const [disabled, setDisabled] = useState(false);
	const [form, setForm] = useState(formData);

	useEffect(() => {
		const fetchRequested = async () => {
			setLoading(true);
			try {
				const data = await get("/api/event/check");
				if (data.requested || data.approved) {
					setDisabled(true);
				} else {
					setDisabled(false);
				}
				console.log(data);
			} catch (error) {
				toast.error(error.data.message || "Fetch Failed");
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		fetchRequested();
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

	const handleChange = (e) => {
		setForm({
			...form,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const data = await post("/api/event/request", form);
			toast.success(data.message || "Event Requested");
			setForm(formData);
			setDisabled(true);
			console.log(data);
		} catch (error) {
			toast.error(error.data.message || "Request Failed");
			console.error(error);
		}
	};

	return (
		<div className="h-[90vh] flex items-center justify-center p-6">
			<Card className="w-4/12 rounded-3xl shadow-lg space-y-4">
				<form
					onSubmit={handleSubmit}
					encType="multipart/form-data">
					<CardHeader className="text-center text-primary">
						<h1 className="text-4xl font-bold tracking-tighter">
							Event Request
						</h1>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<div className="relative">
								<Album className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-foreground h-5 w-5" />
								<Input
									type="text"
									name="title"
									disabled={disabled}
									value={form.title}
									onChange={handleChange}
									placeholder="Event Title"
									className="w-full pl-10 pr-4 py-2 border rounded bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
									required
								/>
							</div>
						</div>
						<div className="space-y-2">
							<div className="relative">
								<ScrollText className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-foreground h-5 w-5" />
								<Input
									type="text"
									name="description"
									disabled={disabled}
									value={form.description}
									onChange={handleChange}
									placeholder="Event Description"
									className="w-full pl-10 pr-4 py-2 border rounded bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
									required
								/>
							</div>
						</div>
						<div className="space-y-2">
							<div className="relative">
								<MapPinned className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-foreground h-5 w-5" />
								<Input
									type="text"
									name="venue"
									disabled={disabled}
									value={form.venue}
									onChange={handleChange}
									placeholder="Event Venue"
									className="w-full pl-10 pr-4 py-2 border rounded bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
									required
								/>
							</div>
						</div>
						<div className="space-y-2">
							<div className="relative">
								<CalendarFold className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-foreground h-5 w-5" />
								<Input
									type="text"
									name="date"
									disabled={disabled}
									value={form.date}
									onChange={handleChange}
									placeholder="Event Date"
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
							<span className="flex items-center gap-2">
								{disabled ? "Event Requested" : "Request Event"}
								<CircleFadingPlus />
							</span>
						</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
