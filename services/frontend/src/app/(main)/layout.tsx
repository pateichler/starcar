import LogoutComponent from "./logout-component";
import Link from "next/link";

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            <LogoutComponent />
            <Link href={"/"}>
                <h1>Starcar</h1>
            </Link>
            <div>
                {children}
            </div>
        </div>
    );
}