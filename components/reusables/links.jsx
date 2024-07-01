import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const CustomLink = ({ text, href, principal = false }) => {
  return (
    <Link href={href} className="flex items-center gap-2">
      <span className="text-primary text-xl font-semibold ">{text}</span>
      <ArrowRight />
    </Link>
  );
};
