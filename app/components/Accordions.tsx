import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "components/ui/accordion";
import Section from "./Section";
import Container from "./Container";
type qnaProps = {
  trigger: string;
  content: string[];
};
const qna: qnaProps[] = [
  {
    trigger:
      "Chi phí dịch vụ được tính như thế nào? Vì sao không có bảng giá cố định?",
    content: [
      "Chi phí phụ thuộc vào mục tiêu, quy mô và hiện trạng thương hiệu của bạn.",
      "Mỗi doanh nghiệp có bài toán khác nhau: ngành nghề, ngân sách, giai đoạn phát triển và nguồn lực nội bộ.",
      "Vì vậy, chúng tôi không áp giá “đại trà”, mà đề xuất giải pháp phù hợp nhất sau khi trao đổi và đánh giá cụ thể.",
    ],
  },
  {
    trigger: "Bao lâu thì tôi có thể thấy hiệu quả sau khi triển khai?",
    content: [
      "Hiệu quả không đến sau vài ngày",
      "Thông thường, 1–2 tháng đầu là xây nền tảng, định hình chiến lược, tối ưu nội dung",
      "3–6 tháng bắt đầu thấy tăng trưởng rõ ràng về nhận diện, tương tác và chuyển đổi",
      "Marketing bền vững là một quá trình, không phải một chiến dịch ngắn hạn.",
    ],
  },
  {
    trigger: "Agency sẽ làm toàn bộ hay cần đội ngũ nội bộ phối hợp?",
    content: [
      "Chúng tôi chịu trách nhiệm chiến lược, triển khai và tối ưu.",
      "Tuy nhiên, sự phối hợp từ phía doanh nghiệp (thông tin sản phẩm, phản hồi, định hướng kinh doanh) sẽ giúp dự án đi nhanh và đúng hơn.",
      "Mục tiêu là đồng hành lâu dài, không chỉ “làm xong rồi bàn giao”.",
    ],
  },
];

const Accordions = () => {
  return (
    <Section>
      <Container>
        <h2 className="text-3xl font-semibold text-gray-900">
          Các câu hỏi thường gặp?
        </h2>
        <p className="mt-4 max-w-xl text-gray-600">
          Chúng tôi xây dựng nội dung từ ý tưởng đến sản phẩm cuối cùng, đảm bảo
          tính sáng tạo, nhất quán và hiệu quả trên từng nền tảng.
        </p>

        <Accordion
          type="single"
          collapsible
          className="w-full mt-4"
          defaultValue="item-1"
        >
          {qna.map((item: qnaProps, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-gray-900 text-lg font-semibold cursor-pointer hover:text-primary hover:underline-primary">
                {item.trigger}
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance pl-2">
                {item.content.map((line, i) => (
                  <p className="mb-3" key={i}>
                    {line}
                  </p>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </Section>
  );
};

export default Accordions;
