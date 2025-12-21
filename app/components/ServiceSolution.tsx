import Container from "./Container";
import Section from "./Section";
import { heroServices } from "../data/heroServices";

const ServiceSolution = () => {
  return (
    <Section background="white" padding="lg">
      <Container>
        <div className="mb-12 max-w-2xl">
          <h2 className="text-3xl font-semibold text-gray-900">
            Dịch vụ chúng tôi cung cấp
          </h2>
          <p className="mt-4 text-gray-600">
            Tập trung vào chiến lược, nội dung và hình ảnh giúp thương hiệu phát
            triển bền vững.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {heroServices.map((service) => (
            <div
              key={service.id}
              className="rounded-xl border border-gray-200 p-6 transition hover:border-primary"
            >
              <div className="mb-4 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-primary">{service.lucideIcon}</span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900">
                {service.title}
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                {service.description}
              </p>

              <ul className="mt-4 space-y-2 text-sm text-gray-700">
                {service.bullets.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
};
export default ServiceSolution;
