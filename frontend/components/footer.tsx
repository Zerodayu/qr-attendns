import Link from "next/link";

export default function Footer() {
    return (
        <section>
            <div className="flex flex-col py-2 items-center justify-center w-full h-auto border-t-2">
                <h1 className="font-mono text-sm text-muted-foreground">
                    Created by{" "}
                    <Link
                        className="font-semibold hover:opacity-50 hover:tracking-widest transition-all duration-500"
                        href="https://zero-kimian.vercel.app"
                        target="_blank"
                        rel="noopener noreferrer">
                        -Zero
                    </Link>
                </h1>
            </div>
        </section>
    )
}