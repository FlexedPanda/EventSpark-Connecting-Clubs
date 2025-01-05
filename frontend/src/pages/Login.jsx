import { useState } from "react";
import { tie } from "@lucide/lab";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Icon } from "lucide-react";
import { Button } from "@/components/ui/button";

import Cover from "../assets/Cover.png";
import useAxios from "../hooks/useAxios.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Login() {
	const formData = {
		email: "",
		password: "",
	};
	const { post } = useAxios();
	const { loggedIn } = useAuth();
	const navigate = useNavigate();
	const [form, setForm] = useState(formData);

	const handleChange = (e) => {
		setForm({
			...form,
			[e.target.name]: e.target.value,
		});
	};

	const handleLogin = async (e) => {
		e.preventDefault();
		try {
			const data = await post("/api/auth/login", form);
			loggedIn(data.token, data.type);
			toast.success(data.message || "Login Successful");
			const path = data.type.toLowerCase();
			navigate(`/app/${path}/dashboard`);
			console.log(data);
		} catch (error) {
			setForm(formData);
			toast.error(error.data.message || "Login Failed");
			console.error(error);
		}
	};

	return (
		<div className="grid min-h-svh lg:grid-cols-3">
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
							onSubmit={handleLogin}
							className="flex flex-col gap-6">
							<div className="flex flex-col items-center gap-2 text-center">
								<h1 className="text-primary tracking-tighter text-2xl font-bold">
									Authentication
								</h1>
								<p className="text-balance text-sm text-primary-foreground">
									Enter Your Credentials for Authentication
								</p>
							</div>
							<div className="grid gap-6">
								<div className="grid gap-2">
									<Label htmlFor="email">Email</Label>
									<div className="relative">
										<Mail className="absolute left-3 mt-3 text-primary-foreground size-4" />
										<Input
											id="email"
											name="email"
											type="email"
											value={form.email}
											onChange={handleChange}
											placeholder="example@email.com"
											className="pl-10 bg-input rounded"
											required
										/>
									</div>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="password">Password</Label>
									<div className="relative">
										<Lock className="absolute left-3 mt-3 text-primary-foreground size-4" />
										<Input
											id="password"
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
									Sign In
								</Button>
								<div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
									<span className="relative z-10 px-2 text-primary-foreground">
										Or continue with
									</span>
								</div>
								<Button
									variant="secondary"
									className="w-full rounded">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24">
										<path
											d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
											fill="currentColor"
										/>
									</svg>
									<a href="https://github.com/FlexedPanda">Login with GitHub</a>
								</Button>
							</div>
							<div className="text-center text-sm">
								Don&apos;t have an account?{" "}
								<a
									href="/app/home/register"
									className="text-primary hover:underline font-medium">
									Sign Up
								</a>
							</div>
							<div className="text-center text-sm">
								Sponsor an event?{" "}
								<a
									href="/app/home/sponsor"
									className="text-primary hover:underline font-medium">
									Apply Now
								</a>
							</div>
						</form>
					</div>
				</div>
			</div>
			<div className="relative col-span-2 hidden bg-muted md:block">
				<img
					src={Cover}
					alt="EventSpark"
					className="absolute inset-0 h-full w-full object-cover"
				/>
			</div>
		</div>
	);
}
