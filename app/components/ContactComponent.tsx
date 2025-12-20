import { useState, type ChangeEvent, type FormEvent } from "react";
import type {
  ContactFormData,
  FormErrors,
  SubmissionStatus,
  WorkCategory,
} from "../types";
import Section from "./Section";
import Container from "./Container";
import { CheckCircle, Loader2, Mail, MapPin, Phone } from "lucide-react";

const SCRIPT_APP =
  "https://script.google.com/macros/s/AKfycbyvqyH4YMfm_Axw4sG_FL0SgZKRJGQ-RnjKEshnMLI6w51YnfgmZ3msXy9DIegbk_HQ/exec";

const categories = [
  { value: "all" as WorkCategory, label: "Tất cả" },
  { value: "smm" as WorkCategory, label: "Truyền thông mạng xã hội" },
  {
    value: "branding" as WorkCategory,
    label: "Thiết kế nhận diện thương hiệu",
  },
  { value: "kol" as WorkCategory, label: "Xây dựng thương hiệu cá nhân KOL" },
  {
    value: "production" as WorkCategory,
    label: "Sản xuất nội dung",
  },
];

const ContactComponent = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    message: "",
  });

  const [errorData, setErrorData] = useState<FormErrors>({});
  const [status, setStatus] = useState<SubmissionStatus>("idle");

  const handleOnChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Vui lòng nhập họ tên";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ!";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Số điện thoại không hợp lệ (10 chữ số)";
    }

    if (!formData.service) {
      newErrors.service = "Vui lòng chọn loại dịch vụ";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Vui lòng nhập nội dung";
    }

    setErrorData(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;

    setStatus("submitting");

    try {
      await fetch(SCRIPT_APP, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      setStatus("success");

      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        service: "",
        message: "",
      });
    } catch (e) {
      console.log("Error submitting form: ", e);
      setStatus("error");
    }
  };

  return (
    <Section padding="lg" background="gray">
      <Container>
        <div className="flex flex-col lg:flex-row overflow-hidden shadow-2xl rounded-3xl">
          <div className="lg:w-2/5 p-10 lg:p-16 bg-primary text-white relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl font-display font-bold mb-6">
                Bắt đầu dự án ngay hôm nay
              </h2>
              <p className="text-blue-100 mb-8 text-lg">
                Đừng để đối thủ vượt qua bạn. Hãy để MTBP giúp bạn bứt phá doanh
                số và thương hiệu.
              </p>

              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-4">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-blue-200 uppercase font-bold">
                      Hotline
                    </p>
                    <p className="font-semibold text-lg">0909 123 456</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-4">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-blue-200 uppercase font-bold">
                      Email
                    </p>
                    <p className="font-semibold text-lg">contact@mtbp.vn</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-4">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-blue-200 uppercase font-bold">
                      Địa chỉ
                    </p>
                    <p className="font-semibold text-lg">Vincom Tây Ninh</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FORM SECTION */}
          <div className="lg:w-3/5 p-10 lg:p-16 bg-white">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Liên hệ tư vấn miễn phí
            </h3>
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center h-full py-10 text-center animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-3">
                  Đã gửi thành công!
                </h4>
                <p className="text-gray-500 mb-8 max-w-md">
                  Cảm ơn <strong>{formData.name}</strong> đã để lại thông tin.{" "}
                  <br />
                  Chúng tôi đã gửi email xác nhận và sẽ liên hệ lại qua số điện
                  thoại của bạn trong vòng 24h.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="cursor-pointer px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Gửi yêu cầu khác
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div>
                  <label className="block text-gray-900 font-semibold mb-2">
                    Họ tên *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleOnChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition ${
                      errorData.name
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-primary"
                    }`}
                    placeholder="Nguyễn Văn A"
                    disabled={status === "submitting"}
                  />
                  {errorData.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errorData.name}
                    </p>
                  )}
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-900 font-semibold mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleOnChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition ${
                        errorData.email
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-primary"
                      }`}
                      placeholder="email@example.com"
                      disabled={status === "submitting"}
                    />
                    {errorData.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errorData.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-900 font-semibold mb-2">
                      Số điện thoại *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleOnChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition ${
                        errorData.phone
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-primary"
                      }`}
                      placeholder="0901234567"
                      disabled={status === "submitting"}
                    />
                    {errorData.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errorData.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Service */}
                <div>
                  <label className="block text-gray-900 font-semibold mb-2">
                    Dịch vụ quan tâm *
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleOnChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition ${
                      errorData.service
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-primary"
                    }`}
                    disabled={status === "submitting"}
                  >
                    <option value="">-- Chọn dịch vụ --</option>
                    <option value="Social Media Marketing">
                      Social Media Marketing
                    </option>
                    <option value="Branding & Design">Branding & Design</option>
                    <option value="Content Production">
                      Content Production
                    </option>
                    <option value="KOL Marketing">KOL Marketing</option>
                    <option value="Full Service Package">
                      Full Service Package
                    </option>
                  </select>
                  {errorData.service && (
                    <p className="text-red-500 text-sm mt-1">
                      {errorData.service}
                    </p>
                  )}
                </div>

                {/* Company */}
                <div>
                  <label className="block text-gray-900 font-semibold mb-2">
                    Thông tin doanh nghiệp
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleOnChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition"
                    placeholder="Tên công ty (không bắt buộc)"
                    disabled={status === "submitting"}
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-gray-900 font-semibold mb-2">
                    Nội dung *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleOnChange}
                    rows={5}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 resize-none transition ${
                      errorData.message
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-primary"
                    }`}
                    placeholder="Mô tả về dự án hoặc nhu cầu của bạn..."
                    disabled={status === "submitting"}
                  />
                  {errorData.message && (
                    <p className="text-red-500 text-sm mt-1">
                      {errorData.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full border-1 border-primary cursor-pointer hover:bg-primary hover:text-white text-primary font-bold py-4 rounded-lg transition-all transform hover:-translate-y-0.5 shadow-lg flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                >
                  {status === "submitting" ? (
                    <>
                      {" "}
                      <Loader2 className="animate-spin mr-2" /> Đang gửi yêu cầu
                      ...
                    </>
                  ) : (
                    "Gửi yêu cầu"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default ContactComponent;
