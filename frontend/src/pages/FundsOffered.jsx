import { LoaderCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import useAxios from "../hooks/useAxios.jsx";

export default function OfferedFunds() {
	const { get, del } = useAxios();
	const [loading, setLoading] = useState(false);
	const [funds, setFunds] = useState([]);

	useEffect(() => {
		const fetchFundedEvents = async () => {
			setLoading(true);
			try {
				const data = await get("/api/fund/offered");
				setFunds(data.offers);
				console.log(data);
			} catch (error) {
				toast.error(error.data.message || "Fetch Failed");
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		fetchFundedEvents();
	}, []);

	const handleCancelFund = async (e, id) => {
		e.preventDefault();
		try {
			const data = await del(`/api/fund/offered/${id}`);
			toast.success(data.message || "Cancel Successful");
			setFunds((prevFunds) => prevFunds.filter((fund) => fund._id !== id));
			console.log(data);
		} catch (error) {
			toast.error(error.data.message || "Cancel Failed");
			console.error(error);
		}
	};

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

	if (!funds || funds.length === 0) {
		return (
			<div className="h-[90vh] flex items-center justify-center p-6">
				<Card className="transition-transform transform hover:scale-125 shadow-md hover:shadow-lg rounded-3xl">
					<CardHeader className="text-center text-2xl font-bold text-primary">
						Funds Offered
					</CardHeader>
					<CardContent className="w-5/1 space-y-4 rounded-lg shadow-lg text-center text-primary-foreground">
						Could Not Find Any Offered Funds
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="h-auto flex items-center justify-center p-6">
			<Card className="w-full rounded-3xl shadow-lg bg-card">
				<CardHeader className="flex justify-center items-center">
					<CardTitle className="text-center text-3xl font-bold text-primary">
						Funds Offered
					</CardTitle>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="text-center text-primary">
									Invoice No.
								</TableHead>
								<TableHead className="text-center text-primary">
									Event
								</TableHead>
								<TableHead className="text-center text-primary">
									Event Date
								</TableHead>
								<TableHead className="text-center text-primary">Club</TableHead>
								<TableHead className="text-center text-primary">
									Funded By
								</TableHead>
								<TableHead className="text-center text-primary">
									Agent
								</TableHead>
								<TableHead className="text-center text-primary">
									Approval Date
								</TableHead>
								<TableHead className="text-center text-primary">
									Amount
								</TableHead>
								<TableHead className="text-center text-primary">
									Action
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{funds.map((fund) => (
								<TableRow key={fund._id}>
									<TableCell className="text-center font-bold text-muted-foreground">
										{fund._id.toString().slice(-6)}
									</TableCell>
									<TableCell className="text-center font-semibold text-primary-foreground">
										{fund.event.title}
									</TableCell>
									<TableCell className="text-center font-semibold text-primary-foreground">
										{new Date(fund.event.date).toLocaleDateString("en-Uk", {
											day: "2-digit",
											month: "short",
											year: "numeric",
										})}
									</TableCell>
									<TableCell className="text-center font-semibold text-primary-foreground">
										{fund.event.club.name}
									</TableCell>
									<TableCell className="text-center font-semibold text-primary-foreground">
										{fund.sponsor.company}
									</TableCell>
									<TableCell className="text-center font-semibold text-primary-foreground">
										{fund.sponsor.name}
									</TableCell>
									<TableCell className="text-center font-semibold text-primary-foreground">
										{new Date(fund.createdAt).toLocaleDateString("en-Uk", {
											day: "2-digit",
											month: "short",
											year: "numeric",
										})}
									</TableCell>
									<TableCell className="text-center font-semibold text-primary-foreground">
										{fund.amount}
									</TableCell>
									<TableCell className="text-center font-semibold text-primary-foreground">
										<Button
											className="rounded"
											onClick={(e) => handleCancelFund(e, fund._id)}>
											Cancel
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}
