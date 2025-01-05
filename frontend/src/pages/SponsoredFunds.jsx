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

export default function SponsoredFunds() {
	const { get, post, del } = useAxios();
	const [loading, setLoading] = useState(false);
	const [funds, setFunds] = useState([]);

	useEffect(() => {
		const fetchFundedEvents = async () => {
			setLoading(true);
			try {
				const data = await get("/api/fund/offers");
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

	const handleAcceptFund = async (e, id) => {
		e.preventDefault();
		try {
			const data = await post(`/api/fund/offers/${id}`);
			toast.success(data.message || "Accept Successful");
			setFunds((prevFunds) => prevFunds.filter((fund) => fund._id !== id));
			console.log(data);
		} catch (error) {
			toast.error(error.data.message || "Accept Failed");
			console.error(error);
		}
	};

	const handleRejectFund = async (e, id) => {
		e.preventDefault();
		try {
			const data = await del(`/api/fund/offers/${id}`);
			toast.success(data.message || "Reject Successful");
			setFunds((prevFunds) => prevFunds.filter((fund) => fund._id !== id));
			console.log(data);
		} catch (error) {
			toast.error(error.data.message || "Reject Failed");
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
						Sponsored Funds
					</CardHeader>
					<CardContent className="w-5/1 space-y-4 rounded-lg shadow-lg text-center text-primary-foreground">
						Could Not Find Any Sponsored Funds
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
						Sponsored Funds
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
									Cost
								</TableHead>
								<TableHead className="text-center text-primary">
									Funds
								</TableHead>
								<TableHead className="text-center text-primary">
									Sponsor
								</TableHead>
								<TableHead className="text-center text-primary">
									Agent
								</TableHead>
								<TableHead className="text-center text-primary">
									Request Date
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
										{fund.event.cost}
									</TableCell>
									<TableCell className="text-center font-semibold text-primary-foreground">
										{fund.event.funds}
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
										<div className="flex items-center justify-center gap-4">
											<Button
												className="text-primary-foreground bg-emerald-700 hover:bg-emerald-700/90 rounded"
												onClick={(e) => handleAcceptFund(e, fund._id)}>
												Accept
											</Button>
											<Button
												className="rounded"
												onClick={(e) => handleRejectFund(e, fund._id)}>
												Reject
											</Button>
										</div>
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
