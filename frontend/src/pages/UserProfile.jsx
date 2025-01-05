import toast from "react-hot-toast";
import { cabin } from "@lucide/lab";
import { useState, useEffect } from "react";
import { Mail, Phone, IdCard, Wallet, Building2, Icon, CircleDollarSign } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

import useAxios from "../hooks/useAxios.jsx";

export default function UserProfile() {
	const { get } = useAxios();
	const [userData, setUserData] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUserProfile = async () => {
			setLoading(true);
			try {
				const data = await get("/api/auth/profile");
				setUserData(data.user);
				console.log(data);
			} catch (error) {
				toast.error(error.data.message || "Fetch Failed");
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		fetchUserProfile();
	}, []);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="animate-pulse text-primary">Loading profile...</div>
			</div>
		);
	}

	if (!userData) {
		return (
			<div className="flex items-center justify-center min-h-[400px] text-destructive">
				Could not load profile data
			</div>
		);
	}

	return (
		<div className="h-[75vh] flex items-center justify-center p-6">
			<Card className="w-1/2 h-auto rounded-3xl shadow-lg bg-card">
				<CardHeader className="pb-0">
					<div className="flex flex-col items-center space-y-4">
						<Avatar className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center">
							<AvatarImage src="https://github.com/shadcn.png" />
							<AvatarFallback>CN</AvatarFallback>
						</Avatar>
						<div className="text-center space-y-1.5">
							<h2 className="text-2xl font-bold">{userData.name}</h2>
							<p className="text-muted-foreground text-sm font-medium">
								{userData.designation ? userData.designation : userData.company ? userData.company : userData.role}
							</p>
						</div>
					</div>
				</CardHeader>
				<CardContent className="mt-6">
					<Separator className="my-6 bg-primary"/>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						<div className="space-y-6">
							<div className="flex items-center space-x-4">
								<div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
									<Mail className="h-5 w-5 text-primary" />
								</div>
								<div className="space-y-1">
									<p className="text-sm text-muted-foreground">Email Address</p>
									<p className="font-medium">{userData.email}</p>
								</div>
							</div>
							<div className="flex items-center space-x-4">
								<div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
									<Phone className="h-5 w-5 text-primary" />
								</div>
								<div className="space-y-1">
									<p className="text-sm text-muted-foreground">Phone Number</p>
									<p className="font-medium">{userData.phone}</p>
								</div>
							</div>
						</div>
						<div className="space-y-6">
							{userData.club && (
								<div className="flex items-center space-x-4">
									<div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
										<Icon iconNode={cabin} className="h-5 w-5 text-primary" />
									</div>
									<div className="space-y-1">
										<p className="text-sm text-muted-foreground">Club</p>
										<p className="font-medium">{userData.club.name}</p>
									</div>
								</div>
							)}
							{userData.funds && (
								<div className="flex items-center space-x-4">
									<div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
										<CircleDollarSign className="h-5 w-5 text-primary" />
									</div>
									<div className="space-y-1">
										<p className="text-sm text-muted-foreground">Funds</p>
										<p className="font-medium">{userData.funds} Taka</p>
									</div>
								</div>
							)}
							<div className="flex items-center space-x-4">
								<div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
									<Wallet className="h-5 w-5 text-primary" />
								</div>
								<div className="space-y-1">
									<p className="text-sm text-muted-foreground">Credits</p>
									<p className="font-medium capitalize">
										{userData.credits} Taka
									</p>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
