import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import toast from "react-hot-toast";
import { BadgeCheck, ChevronsUpDown, LogOut } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import { useAuth } from "../contexts/AuthContext.jsx";
import useAxios from "../hooks/useAxios.jsx";

export function Profile() {
	const { isMobile } = useSidebar();
	const { get, post } = useAxios();
	const [profile, setProfile] = useState(null);
	const { loggedOut } = useAuth();
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			const data = await post("/api/auth/logout");
			loggedOut();
			navigate(data.redirect);
			toast.success(data.message || "Logout Success");
			console.log(data);
		} catch (error) {
			toast.error(error.data.message || "Logout Failed");
			console.error(error);
		}
	};

	const handleProfile = () => {
		const type = localStorage.getItem("type");
		const path = type.toLowerCase();
		toast.success("Displaying User Profile");
		navigate(`/app/${path}/dashboard/profile`);
	};

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const data = await get("/api/auth/profile");
				setProfile(data.user);
				console.log(data);
			} catch (error) {
				toast.error(error.data.message || "Fetch Failed");
				console.error(error);
			}
		};

		fetchProfile();
	}, []);

	if (!profile) {
		return <Skeleton className="h-14 w-full" />;
	}

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							tooltip={profile.name}
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
							<Avatar className="h-8 w-8 rounded">
								<AvatarImage src="https://github.com/shadcn.png" />
								<AvatarFallback>CN</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold">{profile.name}</span>
								<span className="truncate text-xs">{profile.email}</span>
							</div>
							<ChevronsUpDown className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="h-8 w-8 rounded">
									<AvatarImage src="https://github.com/shadcn.png" />
									<AvatarFallback>CN</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">{profile.name}</span>
									<span className="truncate text-xs">{profile.email}</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem onClick={handleProfile}>
								<BadgeCheck />
								Account
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={handleLogout}>
							<LogOut />
							Log Out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
