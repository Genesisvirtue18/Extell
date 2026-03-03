import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import emailjs from "@emailjs/browser";
import {
  FaTools,
  FaDownload,
  FaBatteryHalf,
  FaServer,
  FaQuestionCircle,
  FaUpload,
  FaPaperPlane,
} from "react-icons/fa";
import supportBackground from "../assets/support-background.png";
import { getSupportCategories, submitSupportTicket } from "../lib/api";

const supportServices = [
  {
    title: "Product Warranty Registration",
    desc: "Register your product warranty digitally with serial tracking and lifecycle management.",
    icon: <FaTools />,
    accent: {
      border: "rgba(71, 231, 255, 0.55)",
      bg: "linear-gradient(160deg, rgba(71,231,255,0.2), rgba(71,231,255,0.05) 35%, rgba(1,8,30,0.78) 100%)",
      glow: "0 0 24px rgba(71,231,255,0.22)",
    },
  },
  {
    title: "Software Download Center",
    desc: "Access firmware, drivers, manuals, and secure updates from one hub.",
    icon: <FaDownload />,
    accent: {
      border: "rgba(90, 153, 255, 0.55)",
      bg: "linear-gradient(160deg, rgba(90,153,255,0.2), rgba(90,153,255,0.05) 35%, rgba(1,8,30,0.78) 100%)",
      glow: "0 0 24px rgba(90,153,255,0.22)",
    },
  },
  {
    title: "UPS Runtime Calculator",
    desc: "Estimate backup duration based on load and configuration.",
    icon: <FaBatteryHalf />,
    accent: {
      border: "rgba(86, 244, 214, 0.55)",
      bg: "linear-gradient(160deg, rgba(86,244,214,0.2), rgba(86,244,214,0.05) 35%, rgba(1,8,30,0.78) 100%)",
      glow: "0 0 24px rgba(86,244,214,0.2)",
    },
  },
  {
    title: "UPS Selector",
    desc: "AI-assisted UPS selection based on capacity and business use-case.",
    icon: <FaServer />,
    accent: {
      border: "rgba(228, 122, 255, 0.55)",
      bg: "linear-gradient(160deg, rgba(228,122,255,0.2), rgba(228,122,255,0.05) 35%, rgba(1,8,30,0.78) 100%)",
      glow: "0 0 24px rgba(228,122,255,0.22)",
    },
  },
];

const faqs = [
  {
    q: "Where can we find ExTell Products?",
    a: "ExTell Products are available through a global network of distributors in multiple countries. To reach your nearest distributor, kindly contact sales@extellsystems.com.",
  },
  {
    q: "How can we reach out to ExTell for Project Support?",
    a: "Project support including SCS network design, UPS design, and implementation can be availed through regional distribution partners. You can also email support@extellsystems.com and our team will contact you.",
  },
  {
    q: "How can we enroll as an ExTell Partner?",
    a: "ExTell partners are active in over 20 countries. To enroll and use ExTell products in your projects, please write to sales@extellsystems.com for product training, solution training, and available warranty programs.",
  },
  {
    q: "How can we fix Runtime Calculator issues?",
    a: "Please verify your selected load profile and UPS configuration first. If the issue persists, share screenshots and values with support@extellsystems.com for troubleshooting.",
  },
];

export default function SupportPage() {
  const emailJsServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const emailJsTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const emailJsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  const cloudinaryCloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const cloudinaryUploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const attachmentInputRef = useRef(null);
  const [ticketForm, setTicketForm] = useState({
    email: "",
    serialNumber: "",
    category: "",
    priority: "normal",
    description: "",
  });
  const [attachmentFiles, setAttachmentFiles] = useState([]);
  const [attachmentNames, setAttachmentNames] = useState([]);
  const [submitState, setSubmitState] = useState({
    loading: false,
    error: false,
    message: "",
  });
  const [categoryGroups, setCategoryGroups] = useState([]);

  useEffect(() => {
    let mounted = true;
    getSupportCategories()
      .then((response) => {
        if (!mounted) return;
        setCategoryGroups(response?.items || []);
      })
      .catch(() => {
        if (!mounted) return;
        setCategoryGroups([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleTicketChange = (event) => {
    const { name, value } = event.target;
    setTicketForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || []).filter((file) =>
      file.type.startsWith("image/")
    );
    const names = files.map((file) => file.name);
    setAttachmentFiles(files);
    setAttachmentNames(names);
  };

  const openAttachmentPicker = () => {
    if (!attachmentInputRef.current) return;
    attachmentInputRef.current.click();
  };

  const uploadImagesToCloudinary = async () => {
    if (!attachmentFiles.length) return [];
    if (!cloudinaryCloudName || !cloudinaryUploadPreset) {
      throw new Error("Cloudinary env is missing (VITE_CLOUDINARY_CLOUD_NAME / VITE_CLOUDINARY_UPLOAD_PRESET).");
    }

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`;
    const uploads = attachmentFiles.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", cloudinaryUploadPreset);
      const response = await axios.post(uploadUrl, formData);
      return response.data?.secure_url || "";
    });

    return (await Promise.all(uploads)).filter(Boolean);
  };

  const handleTicketSubmit = async (event) => {
    event.preventDefault();
    setSubmitState({ loading: true, error: false, message: "" });
    try {
      if (!emailJsServiceId || !emailJsTemplateId || !emailJsPublicKey) {
        throw new Error("EmailJS env is missing (VITE_EMAILJS_SERVICE_ID / VITE_EMAILJS_TEMPLATE_ID / VITE_EMAILJS_PUBLIC_KEY).");
      }

      const uploadedUrls = await uploadImagesToCloudinary();
      await submitSupportTicket({
        ...ticketForm,
        attachmentNames,
        attachmentUrls: uploadedUrls,
      });
      const templateParams = {
        work_email: ticketForm.email,
        serial_number: ticketForm.serialNumber || "N/A",
        product_category: ticketForm.category,
        priority_level: ticketForm.priority,
        issue_description: ticketForm.description,
        attachment_names: attachmentNames.join(", ") || "None",
        attachment_urls: uploadedUrls.join("\n") || "None",
        submitted_at: new Date().toLocaleString(),
      };

      await emailjs.send(emailJsServiceId, emailJsTemplateId, templateParams, {
        publicKey: emailJsPublicKey,
      });

      setSubmitState({
        loading: false,
        error: false,
        message: "Ticket submitted successfully. Saved in database and email sent.",
      });
      setTicketForm({
        email: "",
        serialNumber: "",
        category: "",
        priority: "normal",
        description: "",
      });
      setAttachmentFiles([]);
      setAttachmentNames([]);
      if (attachmentInputRef.current) {
        attachmentInputRef.current.value = "";
      }
    } catch (error) {
      setSubmitState({
        loading: false,
        error: true,
        message: error?.message || "Unable to submit ticket. Please try again.",
      });
    }
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden text-white px-6 py-20"
      style={{
        backgroundImage: `radial-gradient(circle at 50% 5%, rgba(89,118,255,0.22), transparent 34%), url(${supportBackground})`,
        backgroundColor: "#020617",
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-8 h-96 w-96 -translate-x-1/2 rounded-full blur-3xl"
          style={{ background: "rgba(0, 201, 255, 0.2)" }}
        />
        <div
          className="absolute right-0 top-44 h-80 w-80 rounded-full blur-3xl"
          style={{ background: "rgba(229, 74, 255, 0.18)" }}
        />
        <div
          className="absolute left-0 top-1/3 h-80 w-80 rounded-full blur-3xl"
          style={{ background: "rgba(86, 140, 255, 0.2)" }}
        />
      </div>

      <div className="relative mx-auto mb-16 max-w-7xl text-center">
        <h1 className="text-4xl font-extrabold tracking-wide md:text-5xl">
          Support Center
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-300">
          Centralized technical support, tools, and services designed for
          enterprise reliability.
        </p>
      </div>

      <div className="relative mx-auto mt-10 mb-10 grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
        {supportServices.map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group relative rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1"
            style={{
              borderColor: service.accent.border,
              background: service.accent.bg,
              boxShadow: service.accent.glow,
            }}
          >
            <div className="relative z-10 flex h-full flex-col space-y-4">
              <div className="text-3xl text-cyan-200">{service.icon}</div>
              <h3 className="text-xl font-semibold">{service.title}</h3>
              <p className="text-sm leading-relaxed text-slate-200/80">
                {service.desc}
              </p>
              <div className="pt-2">
                <button
                  className="ui-focus-ring rounded-full border px-4 py-2 text-sm font-semibold transition hover:bg-white/20"
                  style={{
                    borderColor: "rgba(255,255,255,0.6)",
                    background: "rgba(255,255,255,0.14)",
                    color: "#ffffff",
                  }}
                >
                  Access Service -&gt;
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mx-auto ui-surface-1 mt-16 grid max-w-7xl gap-6 lg:grid-cols-2 rounded-xl mb-10"  style={{
            background:
              "linear-gradient(180deg, rgba(3,10,32,0.68), rgba(2,8,26,0.82))",
            backdropFilter: "blur(1.5px)",
          }}>
        <div className=" relative rounded-3xl p-5 md:p-8" >
          <div className="mb-6">
            <h2 className="text-3xl font-semibold text-neutral-100">Submit a Ticket</h2>
            <p className="mt-2 text-neutral-300">Our engineering team will respond within 24 hours.</p>
          </div>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleTicketSubmit}>
            <label className="space-y-2">
              <span className="text-sm text-neutral-300">Work Email</span>
              <input
                type="email"
                name="email"
                value={ticketForm.email}
                onChange={handleTicketChange}
                required
                placeholder="name@company.com"
                className="ui-input ui-focus-ring w-full rounded-lg px-4 py-3 text-sm outline-none"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm text-neutral-300">Serial Number (Optional)</span>
              <input
                type="text"
                name="serialNumber"
                value={ticketForm.serialNumber}
                onChange={handleTicketChange}
                placeholder="SN-12345678"
                className="ui-input ui-focus-ring w-full rounded-lg px-4 py-3 text-sm outline-none"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm text-neutral-300">Product Category</span>
              <select
                name="category"
                value={ticketForm.category}
                onChange={handleTicketChange}
                required
                className="ui-input ui-focus-ring w-full rounded-lg px-4 py-3 text-sm outline-none"
              >
                <option value="">Select a category...</option>
                {categoryGroups.length
                  ? categoryGroups.map((group) => (
                      <optgroup key={group.name} label={group.name}>
                        <option value={group.name}>{group.name}</option>
                        {Array.isArray(group.subcategories)
                          ? group.subcategories.map((subcategory) => (
                              <option key={`${group.name}-${subcategory}`} value={`${group.name} > ${subcategory}`}>
                                {subcategory}
                              </option>
                            ))
                          : null}
                      </optgroup>
                    ))
                  : (
                    <>
                      <option value="UPS">UPS</option>
                      <option value="Power Electronics">Power Electronics</option>
                      <option value="Networking Products">Networking Products</option>
                      <option value="Fiber Cables">Fiber Cables</option>
                    </>
                  )}
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm text-neutral-300">Priority Level</span>
              <select
                name="priority"
                value={ticketForm.priority}
                onChange={handleTicketChange}
                className="ui-input ui-focus-ring w-full rounded-lg px-4 py-3 text-sm outline-none"
              >
                <option value="normal">Normal (Non-Critical)</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm text-neutral-300">Issue Description</span>
              <textarea
                name="description"
                value={ticketForm.description}
                onChange={handleTicketChange}
                rows={5}
                required
                placeholder="Please describe the issue in detail..."
                className="ui-input ui-focus-ring w-full rounded-lg px-4 py-3 text-sm outline-none"
              />
            </label>
            <div className="space-y-2 md:col-span-2">
              <span className="text-sm text-neutral-300">Attachments</span>
              <div
                className="ui-focus-ring cursor-pointer rounded-xl border border-dashed border-white/30 bg-white/5 p-6 text-center"
                onClick={openAttachmentPicker}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openAttachmentPicker();
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <FaUpload className="mx-auto mb-2 text-lg text-neutral-300" />
                <p className="text-sm text-neutral-300">Click to upload or drag and drop</p>
                <p className="mt-1 text-xs text-neutral-400">JPG, PNG, WEBP (MAX. 10MB each)</p>
                <input
                  ref={attachmentInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
                {attachmentNames.length ? (
                  <p className="mt-2 text-xs text-neutral-400">
                    {attachmentNames.join(", ")}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={submitState.loading}
                className="ui-focus-ring inline-flex items-center gap-2 rounded-lg bg-[#ed2125] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#d91f23] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <FaPaperPlane />
                {submitState.loading ? "Submitting..." : "Submit Ticket"}
              </button>
              {submitState.message ? (
                <p className={`mt-3 text-sm ${submitState.error ? "text-red-300" : "text-emerald-300"}`}>
                  {submitState.message}
                </p>
              ) : null}
            </div>
          </form>
        </div>

        <div
          className=" relative rounded-3xl p-6 md:p-8"
         
        >
          <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{ boxShadow: "inset 0 0 90px rgba(0, 0, 0, 0.28)" }} />
          <div className="relative">
            <h2 className="mb-6 text-3xl font-bold">FAQs</h2>
            <div className="grid grid-cols-1">
              {faqs.map((item, i) => (
                <details
                  key={i}
                  className="ui-surface-2 group mt-4 rounded-xl p-5 transition-all"
                  style={{
                    background: "rgba(15, 23, 42, 0.44)",
                  }}
                >
                  <summary className="flex cursor-pointer items-start justify-between gap-3 text-lg font-medium">
                    <span>{item.q}</span>
                    <span className="mt-1 text-cyan-300 transition-transform group-open:rotate-45">
                      <FaQuestionCircle />
                    </span>
                  </summary>
                  <p className="mt-4 text-sm leading-relaxed text-slate-300">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
        <div className="mt-24 max-w-7xl rounded-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="ui-surface-2 rounded-xl p-10 text-center"
          style={{
            borderColor: "rgba(255, 164, 132, 0.5)",
            background:
              "linear-gradient(120deg, rgba(214,45,98,0.65), rgba(234,88,12,0.65))",
            boxShadow: "0 25px 80px rgba(255, 80, 20, 0.35)",
          }}
        >
          <h2 className="text-2xl  font-bold md:text-3xl p-4">
            Need Enterprise Support?
          </h2>
          <p className="mt-3 text-orange-50/90">
            Connect directly with our technical experts for priority assistance.
          </p>
          <div className="m-6">
            <button
              className="ui-focus-ring rounded-full px-8 py-3 font-semibold transition"
              style={{ background: "#ffffff", color: "#b91c1c" }}
            >
              Contact Support
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
