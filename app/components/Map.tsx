import Container from "./Container";
import Section from "./Section";

const Map = () => {
  return (
    <Section>
      <Container>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d244.51277288529636!2d106.10196813949476!3d11.319768030352245!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310b6bb0d52f6c15%3A0x73154d666151b6f6!2zNjMgVHLGsMahbmcgVMO5bmcgUXXDom4!5e0!3m2!1svi!2s!4v1766370111556!5m2!1svi!2s"
          width="600"
          height="450"
          loading="lazy"
          className="aspect-video w-full border-none rounded-sm"
        ></iframe>
      </Container>
    </Section>
  );
};

export default Map;
