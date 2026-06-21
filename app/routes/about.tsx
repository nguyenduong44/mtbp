import { motion } from "framer-motion";
import Container from "../components/Container";
import Section from "../components/Section";
import type { Route } from "./+types/about";
import { CheckCircle2, Target } from "lucide-react";
import { useLoaderData } from "react-router";

const stats = [
  { label: "Khách hàng tin tưởng", value: "30+" },
  { label: "Hình ảnh & video social được sản xuất", value: "1000+" },
  { label: "Hạng mục Online & Offline đã thực hiện", value: "200+" },
];

const team = [
  { name: "Thịnh", role: "Founder" },
  { name: "Mai", role: "Cameraman & Editor" },
  { name: "Khánh", role: "Account / Editor" },
  { name: "Đăng", role: "Cameraman" },
  { name: "Huỳnh", role: "Designer" },
  { name: "Phương", role: "Creator / Copywriter" },
];

const values = [
  {
    title: "Thấu hiểu sâu sắc - Giải pháp chuẩn xác",
    desc: "Với MTBP, một giải pháp đúng luôn bắt nguồn từ sự thấu hiểu doanh nghiệp, khách hàng và thị trường. Chúng tôi ưu tiên tính định hướng rõ ràng, bám sát vào thực tế kinh doanh để mỗi bước đi đều chuẩn xác và tối ưu.",
  },
  {
    title: "Hình ảnh chỉn chu - Giá trị vững vàng",
    desc: "Từ một bài đăng nhỏ đến một chiến dịch lớn, MTBP luôn đặt sự chỉn chu và tính nhất quán lên hàng đầu. Một thương hiệu mạnh không chỉ thu hút bởi vẻ ngoài bắt mắt, mà còn phải chinh phục khách hàng bằng giá trị thật và cốt lõi vững vàng để tạo dựng lòng tin bền bỉ theo thời gian.",
  },
  {
    title: "Đồng hành và tin tưởng",
    desc: "MTBP mong muốn trở thành một người bạn đồng hành cùng thương hiệu để mang lại những giải pháp marketing tối ưu. Mục tiêu cao nhất của chúng tôi không chỉ là tạo ra sức hút nhất thời, mà là mang lại hiệu quả thực tế và sự tin tưởng tuyệt đối cho thương hiệu.",
  },
];

export async function loader() {
  return {
    stats,
    team,
    values,
  };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Về chúng tôi | MTBP Agency" },
    {
      name: "description",
      content:
        "Câu chuyện, tầm nhìn và giá trị cốt lõi của MTBP Agency - Make Tay Ninh Better Place.",
    },
  ];
}

export default function About() {
  const { stats, team, values } = useLoaderData<typeof loader>();

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <Section background="white" padding="xl" className="relative">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl text-left"
          >
            <h1 className="text-sm uppercase tracking-[0.3em] text-primary mb-6">
              Về chúng tôi
            </h1>
            <h2 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight mb-8">
              Make Tây Ninh <br />
              <span className="text-primary italic">Better Place.</span>
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed font-medium">
              Chúng mình bắt đầu từ một lý do đơn giản: Làm cho thương hiệu địa
              phương tốt hơn từng chút một, chuyên nghiệp hơn và đáng tin hơn.
            </p>
          </motion.div>
        </Container>
      </Section>

      {/* Story Section */}
      <Section background="gray" padding="lg">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-bold text-gray-900 mb-8 uppercase text-left">
                Câu chuyện MTBP ra đời
              </h3>
              <div className="space-y-6 text-gray-600 text-lg leading-relaxed text-left">
                <p>
                  MTBP được bắt đầu từ một suy nghĩ rất đơn giản. Ở Tây Ninh có
                  nhiều thương hiệu, nhiều mô hình kinh doanh và nhiều con người
                  làm nghề rất nghiêm túc, nhưng không phải ai cũng có một cách
                  xuất hiện đủ rõ ràng, chỉn chu và đúng với giá trị thật của
                  mình.
                </p>
                <p>
                  Nhiều doanh nghiệp làm rất tốt ở bên trong, nhưng khi bước ra
                  bên ngoài, hình ảnh lại chưa đủ chuyên nghiệp, nội dung chưa
                  đủ chạm. Từ đó, MTBP ra đời với mong muốn góp phần làm cho
                  thương hiệu địa phương tốt hơn bằng những gì thực tế nhất:
                  hình ảnh tốt hơn, nội dung rõ hơn và chiến lược sát hơn.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-[3rem] shadow-xl shadow-gray-200 border border-gray-100 text-left"
            >
              <Target className="text-primary mb-6" size={40} />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Tầm nhìn của chúng mình
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                MTBP hướng đến việc trở thành một agency thực chiến, đáng tin và
                đủ hiểu thị trường địa phương để đồng hành lâu dài cùng các
                thương hiệu tại Tây Ninh và khu vực miền Nam.
              </p>
              <div className="mt-10 grid grid-cols-1 gap-6">
                {stats.map((stat, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-6 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:scale-105 transition-transform duration-300"
                  >
                    <span className="text-4xl font-black text-primary">
                      {stat.value}
                    </span>
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-tight">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* Core Values */}
      <Section background="white" padding="lg">
        <Container>
          <div className="text-center mb-20">
            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-primary mb-4">
              Triết lý làm nghề
            </h3>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter">
              Giá trị cốt lõi
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center gap-8 text-left">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-[2.5rem] bg-gray-50 border border-gray-100 hover:bg-gray-900 group transition-all duration-500"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                  <CheckCircle2
                    className="text-primary group-hover:text-white transition-colors"
                    size={24}
                  />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-white transition-colors leading-tight">
                  {v.title}
                </h4>
                <p className="text-gray-500 group-hover:text-gray-400 transition-colors leading-relaxed">
                  {v.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Team Section */}
      {/* <Section background="gray" padding="lg"> */}
      {/*   <Container> */}
      {/*     <div className="text-left mb-16"> */}
      {/*       <h3 className="text-sm font-black uppercase tracking-[0.3em] text-primary mb-4"> */}
      {/*         Con người tại MTBP */}
      {/*       </h3> */}
      {/*       <h2 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter"> */}
      {/*         Gặp gỡ đội ngũ */}
      {/*       </h2> */}
      {/*     </div> */}
      {/**/}
      {/*     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center"> */}
      {/*       {team.map((member, i) => ( */}
      {/*         <motion.div */}
      {/*           key={i} */}
      {/*           initial={{ opacity: 0, scale: 0.9 }} */}
      {/*           whileInView={{ opacity: 1, scale: 1 }} */}
      {/*           viewport={{ once: true }} */}
      {/*           transition={{ delay: i * 0.1 }} */}
      {/*           className="text-center" */}
      {/*         > */}
      {/*           <div className="aspect-square rounded-3xl bg-white border border-gray-100 mb-4 flex items-center justify-center shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden"> */}
      {/*             <div className="text-3xl font-black text-gray-100 group-hover:text-primary transition-colors duration-500 group-hover:scale-150 uppercase"> */}
      {/*               {member.name[0]} */}
      {/*             </div> */}
      {/*           </div> */}
      {/*           <h4 className="font-bold text-gray-900">{member.name}</h4> */}
      {/*           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1"> */}
      {/*             {member.role} */}
      {/*           </p> */}
      {/*         </motion.div> */}
      {/*       ))} */}
      {/*     </div> */}
      {/*   </Container> */}
      {/* </Section> */}

      {/* Closing Section */}
      <Section background="white" padding="xl">
        <Container>
          <div className="bg-secondary rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full" />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative z-10"
            >
              <h2 className="text-3xl md:text-5xl font-black text-black mb-8 uppercase tracking-tighter">
                Cùng nhau làm cho <br />
                thương hiệu của bạn{" "}
                <span className="text-primary italic">tốt hơn</span>
              </h2>
              <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto font-medium">
                Tụi mình luôn sẵn sàng lắng nghe và đồng hành cùng bạn trên hành
                trình xây dựng giá trị thật cho thương hiệu.
              </p>
              <a
                href="/lien-he"
                className="inline-block bg-primary text-white font-bold px-12 py-5 rounded-full hover:bg-white hover:text-primary transition-all duration-500 shadow-2xl shadow-primary/20"
              >
                Bắt đầu ngay hôm nay
              </a>
            </motion.div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
