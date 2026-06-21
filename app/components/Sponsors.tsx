import Container from "./Container";
import Section from "./Section";
import { useClients } from "../hooks/useClients";
import { Loader2 } from "lucide-react";
import type { ClientRow } from "../types";

interface SponsorsProps {
  initialData?: ClientRow[];
}

const Sponsors = ({ initialData }: SponsorsProps) => {
  const { data: clientsData, isLoading: queryLoading } = useClients(
    {
      limit: 6,
      sortBy: "name",
      sortOrder: "desc",
    },
    { enabled: !initialData },
  );

  const clients = initialData || clientsData?.data || [];
  const isLoading = !initialData && queryLoading;

  return (
    <Section padding="sm" background="gray">
      <Container className="flex flex-col items-center justify-center">
        <h3 className="text-lg font-medium text-slate-600 text-center">
          Được tin tưởng bởi các đối tác địa phương
        </h3>

        {isLoading && clients.length === 0 ? (
          <div className="flex justify-center py-10 mt-14">
            <Loader2 className="animate-spin text-gray-400" size={32} />
          </div>
        ) : (
          <div className="max-w-4xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 w-full mt-14">
            {clients.map((client) => (
              <div
                key={client.id}
                className="bg-gray-100 p-4 w-full grid place-content-center rounded-xl hover:-translate-y-0.5 transition duration-200 border border-gray-200/50 shadow-sm overflow-hidden"
              >
                {client.logo ? (
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="w-auto h-20 object-contain transition-all duration-300"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center">
                    {client.name}
                  </span>
                )}
              </div>
            ))}

            {clients.length === 0 && (
              <div className="col-span-full text-center py-10 text-gray-400 italic">
                Chưa có đối tác nào được hiển thị.
              </div>
            )}
          </div>
        )}
      </Container>
    </Section>
  );
};

export default Sponsors;
