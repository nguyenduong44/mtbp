import { Link } from "react-router";
import Section from "./Section";
import Container from "./Container";

export default function Footer() {
  return (
    <>
      <Section padding="sm" background="gray">
        <Container>
          <div className="flex flex-col md:flex-row items-start justify-center md:justify-between gap-10 py-10 border-b border-gray-500/30">
            <div className="max-w-96">
              <Link
                to={"/"}
                className="flex-shrink-0 flex items-center gap-2 cursor-pointer text-primary text-lg font-bold"
              >
                MTBP
              </Link>

              <p className="mt-6 text-sm text-gray-500">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been.
              </p>
            </div>

            <div>
              <h2 className="font-semibold text-gray-900 mb-5">MTBP</h2>
              <div className="text-sm text-gray-500 space-y-2 list-none">
                <li>
                  <a href="#">Về chúng tôi</a>
                </li>
                <li>
                  <a href="#">Dự án</a>
                </li>
                <li>
                  <a href="#">Giải pháp</a>
                </li>
                <li>
                  <a href="#">Tuyển dụng</a>
                </li>
              </div>
            </div>
            <div>
              <h2 className="font-semibold mb-5">Liên hệ</h2>
              <div className="text-sm space-y-2">
                <p>09213123123123</p>
                <p>contact@mtbp.talent</p>
              </div>
            </div>
          </div>
          <p className="py-4 text-center text-xs md:text-sm text-gray-500">
            Copyright 2024 ©. All Right Reserved.
          </p>
        </Container>
      </Section>
    </>
  );
}
