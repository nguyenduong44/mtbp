import { Link } from "react-router";
import Container from "./Container";

export default function Footer() {
  return (
    <div className="w-full bg-white">
      <Container className="flex flex-col md:flex-row items-start justify-center md:justify-between gap-10 py-10 border-b border-gray-500/30">
        <div className="md:max-w-96">
          <Link
            to={"/"}
            className="flex-shrink-0 flex items-center gap-2 cursor-pointer text-primary text-lg font-bold"
          >
            MTBP
          </Link>

          <p className="mt-6 text-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
        </div>
        <div className="flex-1 flex items-start md:justify-end gap-20 md:gap-40">
          <div>
            <h2 className="font-semibold mb-5">Về doanh nghiệp</h2>
            <ul className="text-sm space-y-2">
              <li>
                <a href="#">Dự án</a>
              </li>
              <li>
                <a href="#">Giải pháp</a>
              </li>
              <li>
                <a href="#">Tuyển dụng</a>
              </li>
              <li>
                <a href="#">Liên hệ</a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="font-semibold mb-5">Văn phòng</h2>
            <div className="text-sm space-y-2">
              <p>09123213213</p>
              <p>hr@mtbp.vn</p>
              <p>63 Vincom Tây Ninh</p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
