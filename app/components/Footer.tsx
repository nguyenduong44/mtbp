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
            MTBP tin rằng mỗi thương hiệu đều có một câu chuyện riêng và xứng
            đáng được thể hiện theo cách tốt hơn. Chúng mình ở đây để lắng nghe,
            đồng hành và cùng thương hiệu tạo ra những hình ảnh, nội dung và
            giải pháp marketing vừa đúng với thực tế, vừa có giá trị lâu dài.
          </p>
        </div>
        <div className="flex-1 flex items-start md:justify-end gap-20 md:gap-40">
          <div>
            <h2 className="font-semibold mb-5 uppercase tracking-wider text-xs">Doanh nghiệp</h2>
            <ul className="text-sm space-y-3">
              <li>
                <Link to="/ve-chung-toi" className="hover:text-primary transition-colors">Về chúng tôi</Link>
              </li>
              <li>
                <Link to="/du-an" className="hover:text-primary transition-colors">Dự án</Link>
              </li>
              <li>
                <Link to="/giai-phap" className="hover:text-primary transition-colors">Giải pháp</Link>
              </li>
              <li>
                <Link to="/tuyen-dung" className="hover:text-primary transition-colors">Tuyển dụng</Link>
              </li>
              <li>
                <Link to="/lien-he" className="hover:text-primary transition-colors">Liên hệ</Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="font-semibold mb-5">Văn phòng</h2>
            <div className="text-sm space-y-2">
              <p>09123213213</p>
              <p>mtbpagency@gmail.com</p>
              <p>63 Trương Tùng Quân, Tây Ninh, Vietnam</p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
