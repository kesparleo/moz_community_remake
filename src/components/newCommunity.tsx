import React, { useState } from "react";
import styles from "../styles/Modal.module.css";
import { FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaWhatsapp,
  FaGithub,
  FaTelegram,
  FaYoutube,FaCamera, FaInstagram } from "react-icons/fa";

interface Props {
  onClose: () => void;
}

interface CommunityForm {
  name: string;
  description: string;
  socialLinks: string;
  email: string;
  website: string;
  image: File | null;
}

const CommunityModal: React.FC<Props> = ({ onClose }) => {
  const [form, setForm] = useState<CommunityForm>({
    name: "",
    description: "",
    socialLinks: "",
    email: "",
    website: "",
    image: null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui podes enviar os dados para uma API ou guardar no estado global
    console.log(form);
    onClose(); // fecha o modal após submissão
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          X
        </button>
        <h2 className={styles.title}>Nova Comunidade</h2>

        <form className={styles.communityForm} onSubmit={handleSubmit}>
          <label>
            Nome:
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Moz..."
            />
          </label>

          <label>Descrição:</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            placeholder="Comunidade dedicada a ..."
          />

          <label>
            Links de Redes Sociais
            <div>
              <FaInstagram/>
              <FaTelegram/>
              <FaLinkedinIn/>
              <FaYoutube/>
              <FaGithub/>
              <FaWhatsapp/>
              <FaTwitter/>
              <FaLinkedinIn/>
              <FaFacebookF/>
            </div>
          </label>

          <label>
            Email de contacto:
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="moz...@..."
            />
          </label>

          <label>
            Website:
            <input
              type="url"
              name="website"
              value={form.website}
              onChange={handleChange}
              placeholder="moz..."
            />
          </label>

          <label className={styles.imageUpload}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
              id="logoUpload"
              required
            />

            <div
              className={styles.uploadIconContainer}
              onClick={() => document.getElementById("logoUpload")?.click()}
            >
              {form.image ? (
                <img
                  src={URL.createObjectURL(form.image)}
                  alt="Pré-visualização"
                  className={styles.previewImage}
                />
              ) : (
                <FaCamera className={styles.cameraIcon} />
              )}
            </div>

            <span className={styles.uploadText}>Inserir Logotipo</span>

            {form.image && (
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => setForm((prev) => ({ ...prev, image: null }))}
              >
                Remover
              </button>
            )}
          </label>

          <button type="submit">Criar Comunidade</button>
        </form>
      </div>
    </div>
  );
};

export default CommunityModal;
