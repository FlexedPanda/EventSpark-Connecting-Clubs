import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import * as React from "react";
import { tie } from "@lucide/lab";
import { Icon } from "lucide-react";

export function Badge() {
	const handleRedirect = () => {
		localStorage.clear();
		window.location.href = "/app";
	};

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton
					size="lg"
					tooltip="EventSpark"
					onClick={handleRedirect}
					className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
					<div className="flex aspect-square size-8 items-center justify-center rounded bg-sidebar-primary text-sidebar-primary-foreground">
						<Icon
							iconNode={tie}
							size={24}
						/>
					</div>
					<div className="grid flex-1 text-left text-sm leading-tight">
						<span className="truncate font-semibold">EventSpark</span>
						<span className="truncate text-xs">Connecting Clubs</span>
					</div>
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
