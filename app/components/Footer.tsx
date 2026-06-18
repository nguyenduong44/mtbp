import { Link } from "react-router";
import Container from "./Container";
import { Facebook, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <div className="w-full bg-white">
      <Container className="flex flex-col md:flex-row items-start justify-center md:justify-between gap-10 py-10 border-b border-gray-500/30">
        <div className="md:max-w-96">
          <Link
            to={"/"}
            className="flex-shrink-0 flex items-center gap-2 cursor-pointer text-primary text-lg font-bold"
          >
            <img src="/logo_3.png" />
          </Link>

          <p className="mt-6 text-md text-center text-justify">
            MTBP tin rằng mỗi thương hiệu đều có một câu chuyện riêng và xứng
            đáng được thể hiện theo cách tốt hơn. Chúng mình ở đây để lắng nghe,
            đồng hành và cùng thương hiệu tạo ra những hình ảnh, nội dung và
            giải pháp marketing vừa đúng với thực tế, vừa có giá trị lâu dài.
          </p>
        </div>
        <div className="flex-1 flex flex-col md:flex-row items-start md:justify-end gap-10 md:gap-20 md:gap-40">
          <div>
            <h2 className="font-semibold mb-5 uppercase tracking-wider text-xs">
              Doanh nghiệp
            </h2>
            <ul className="text-md space-y-3">
              <li>
                <Link
                  to="/ve-chung-toi"
                  className="hover:text-primary transition-colors"
                >
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link
                  to="/du-an"
                  className="hover:text-primary transition-colors"
                >
                  Dự án
                </Link>
              </li>
              <li>
                <Link
                  to="/giai-phap"
                  className="hover:text-primary transition-colors"
                >
                  Giải pháp
                </Link>
              </li>
              <li>
                <Link
                  to="/tuyen-dung"
                  className="hover:text-primary transition-colors"
                >
                  Tuyển dụng
                </Link>
              </li>
              <li>
                <Link
                  to="/lien-he"
                  className="hover:text-primary transition-colors"
                >
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="font-semibold mb-5">Văn phòng</h2>
            <div className="text-md flex flex-col gap-4 justify-between w-full h-full">
              <p className="">
                63 Trương Tùng Quân, Tân Ninh, Tây Ninh, Vietnam
              </p>

              <a
                href="mailto:mtbpagency@gmail.com"
                className="w-fit relative group hover:text-backup transition-all duration-300 ease-out"
              >
                mtbpagency@gmail.com
                <span className="absolute -bottom-1 right-1/2 w-0 transition-all h-[1px] bg-backup group-hover:w-3/6 duration-300 ease-out"></span>
                <span className="absolute -bottom-1 left-1/2 w-0 transition-all h-[1px] bg-backup group-hover:w-3/6 duration-300 ease-out"></span>
              </a>
              <div className="flex gap-4">
                <Link
                  to={"https://www.facebook.com/MTBPAGENCY"}
                  className="p-2 border border-2 transition-all duration-300 ease-out border-transparent hover:text-primary hover:border-primary rounded-xl"
                >
                  <Facebook size={25} />
                </Link>
                <Link
                  to={
                    "https://www.instagram.com/mtbpagency?fbclid=IwY2xjawSgPehleHRuA2FlbQIxMABicmlkETFGZ3hFdzhKOUI0ZVBad01Dc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHl6OqzCZl9TQ0F13LyLwGe3ItzOKNHYhN7m-5t_vXzsgQ3G5qkzgXoYVKsdv_aem_5jD9sIoQDWuKHyhmKNWzyg"
                  }
                  className="p-2 border border-2 transition-all duration-300 ease-out border-transparent hover:text-primary hover:border-primary rounded-xl"
                >
                  <Instagram size={25} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
