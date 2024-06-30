import FloatingCart from "@/components/ui/FloatingCart";
import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";
import { role } from "@/constants/role";
import useSession from "@/hooks/useSession";
import { useAppSelector } from "@/redux/reduxHook";
import { Flex } from "@chakra-ui/react";
import React from "react";

export interface LayoutProps {
	children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
	const profile = useAppSelector((state) => state.profile);
	const carts = useAppSelector((s) => s.cart);

	const userCart =
		carts.store.find((s) => s.account_id === profile.id) ?? { user_id: 0, order: [], n_item: 0, total: 0 };

	return (
		<Flex
			flexDirection={"column"}
			justifyContent={"space-between"}
			className="min-h-screen relative"
		>
			{profile.role === role.USER && (
				<FloatingCart cartQuantity={userCart.n_item} cartTotal={userCart.total} />
			)}
			<Flex flexDirection={"column"}>
				<Header role={profile.role ?? ""} />
				<main className="max-w-screen">{children}</main>
			</Flex>
			<Footer />
		</Flex>
	);
}
