import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import useAxios from "../hooks/useAxios.jsx";

export function Navlink({ links }) {
	const { get } = useAxios();
	const navigate = useNavigate();

	const handleRedirect = async (path, title) => {
		try {
			const data = await get("/api/auth/protect");
			navigate(path);
			toast.success(`Redirected to ${title}`);
			console.log(data);
		} catch (error) {
			toast.error(error.data.message || "Fetch Failed");
			localStorage.clear();
			navigate("/app/home/login");
			console.error(error);
		}
	};

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Sidebar Menu</SidebarGroupLabel>
			<SidebarMenu>
				{links.map((link) => (
					<SidebarMenuItem key={link.title}>
						<SidebarMenuButton
							tooltip={link.title}
							onClick={() => handleRedirect(link.path, link.title)}>
							{link.icon && <link.icon />}
							<span>{link.title}</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
