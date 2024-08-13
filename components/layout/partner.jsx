import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const partners = [
  { name: "Foodsa", link: "#" },
  { name: "Yali Sport Africa", link: "https://yalisport.org" },
  { name: "Livegood", link: "https://shoplivegood.com/lachofit" },
  { name: "EcoTech", link: "#" },
  { name: "NanoSystems", link: "#" },
];

const PartnerCard = ({ partner }) => (
  <Card>
    <CardContent className="p-4">
      <a href={partner.link} target="_blank" rel="noopener noreferrer">
        <h3 className="text-lg font-semibold">{partner.name}</h3>
      </a>
    </CardContent>
  </Card>
);

const PartnerShowcase = () => {
  return (
    <section className="py-8">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Partners</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {partners.map((partner) => (
            <PartnerCard key={partner.name} partner={partner} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnerShowcase;
