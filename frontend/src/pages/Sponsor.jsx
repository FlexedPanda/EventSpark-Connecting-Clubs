import toast from "react-hot-toast";
import { tie } from "@lucide/lab";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Icon, Building2, IdCard, Tag, Phone, Mail, Lock } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import Cover from "../assets/Cover.png";
import useAxios from "../hooks/useAxios.jsx";

export default function Sponsor() {
	const formData = {
		name: "",
		company: "",
		event: "",
		phone: "",
		email: "",
		password: "",
	};
	const navigate = useNavigate();
	const { get, post } = useAxios();
	const [events, setEvents] = useState([]);
	const [form, setForm] = useState(formData);

	useEffect(() => {
		const fetchEvents = async () => {
			try {
				const data = await get("/api/auth/events");
				setEvents(data.events);
				navigate(data.redirect);
				console.log(data);
			} catch (error) {
				toast.error(error.data.message || "Fetch Failed");
				console.error(error);
			}
		};

		fetchEvents();
	}, []);

	const handleChange = (e) => {
		setForm({
			...form,
			[e.target.name]: e.target.value,
		});
	};

	const handleSelect = (value) => {
		setForm({
			...form,
			event: value,
		});
	};

	const handleSponsor = async (e) => {
		e.preventDefault();
		try {
			const data = await post("/api/auth/sponsor", form);
			toast.success(data.message || "Sponsor Successful");
			navigate(data.redirect);
			console.log(data);
		} catch (error) {
			setForm(formData);
			toast.error(error.data.message || "Sponsor Failed");
			console.error(error);
		}
	};

	return (
		<div className="grid min-h-svh lg:grid-cols-3">
			<div className="relative col-span-2 hidden bg-muted md:block">
				<img
					src={Cover}
					alt="EventSpark"
					className="absolute inset-0 h-full w-full object-cover"
				/>
			</div>
			<div className="flex flex-col gap-4 p-6 md:p-10 bg-card">
				<div className="flex justify-center gap-2 md:justify-start">
					<a
						href="/app"
						className="flex items-center gap-2 font-medium">
						<div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground">
							<Icon
								iconNode={tie}
								size={16}
							/>
						</div>
						<p className="text-primary-foreground hover:text-primary">
							EventSpark
						</p>
					</a>
				</div>
				<div className="flex flex-1 items-center justify-center">
					<div className="w-full max-w-xs">
						<form
							onSubmit={handleSponsor}
							className="flex flex-col gap-6">
							<div className="flex flex-col items-center gap-2 text-center">
								<h1 className="text-primary tracking-tighter text-2xl font-bold">
									Sponsorship
								</h1>
								<p className="text-balance text-sm text-primary-foreground">
									Enter Your Contacts for Event Sponsorship
								</p>
							</div>
							<div className="grid gap-6">
								<div className="grid gap-2">
									<div className="relative">
										<IdCard className="absolute left-3 mt-3 text-primary-foreground size-4" />
										<Input
											name="name"
											type="text"
											value={form.name}
											onChange={handleChange}
											placeholder="Agent Name"
											className="pl-10 bg-input rounded"
											required
										/>
									</div>
								</div>
								<div className="grid gap-2">
									<div className="relative">
										<Building2 className="absolute left-3 mt-3 text-primary-foreground size-4" />
										<Input
											name="company"
											type="text"
											value={form.company}
											onChange={handleChange}
											placeholder="Sponsor Company"
											className="pl-10 bg-input rounded"
											required
										/>
									</div>
								</div>
								<div className="grid gap-2">
									<div className="relative">
										<Tag className="absolute left-3 mt-3 text-primary-foreground size-4" />
										<Select
											name="event"
											value={form.event}
											onValueChange={handleSelect}
											required>
											<SelectTrigger className="pl-10 bg-input rounded text-muted-foreground">
												<SelectValue placeholder="Select Event" />
											</SelectTrigger>
											<SelectContent>
												<SelectGroup>
													<SelectLabel>Campus Events</SelectLabel>
													{events.map((event) => (
														<SelectItem
															key={event._id}
															value={event._id}>
															{event.title}
														</SelectItem>
													))}
												</SelectGroup>
											</SelectContent>
										</Select>
									</div>
								</div>
								<div className="grid gap-2">
									<div className="relative">
										<Phone className="absolute left-3 mt-3 text-primary-foreground size-4" />
										<Input
											name="phone"
											type="tel"
											value={form.phone}
											onChange={handleChange}
											placeholder="Phone Number"
											className="pl-10 bg-input rounded"
											required
										/>
									</div>
								</div>
								<div className="grid gap-2">
									<div className="relative">
										<Mail className="absolute left-3 mt-3 text-primary-foreground size-4" />
										<Input
											name="email"
											type="email"
											value={form.email}
											onChange={handleChange}
											placeholder="Email Address"
											className="pl-10 bg-input rounded"
											required
										/>
									</div>
								</div>
								<div className="grid gap-2">
									<div className="relative">
										<Lock className="absolute left-3 mt-3 text-primary-foreground size-4" />
										<Input
											name="password"
											type="password"
											value={form.password}
											onChange={handleChange}
											placeholder="Password"
											className="pl-10 bg-input rounded"
											required
										/>
									</div>
								</div>
								<Button
									type="submit"
									className="w-full rounded">
									Apply Now
								</Button>
							</div>
							<div className="text-center text-sm">
								Already a Sponsor?{" "}
								<a
									href="/app/home/login"
									className="text-primary hover:underline font-medium">
									Sign In
								</a>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
