import React, { useState, useRef } from "react";
import styles from "../styles/Modal.module.css";
import { 
  FaFacebookF, FaTwitter, FaLinkedinIn, FaWhatsapp, 
  FaGithub, FaTelegram, FaYoutube, FaCamera, FaInstagram, FaTimes 
} from "react-icons/fa";

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

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    console.log("Formulário enviado:", form);
    onClose();
  };

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Fechar">
          <FaTimes />
        </button>
        
        <header className={styles.header}>
          <h2 className={styles.title}>Nova Comunidade</h2>
          <p className={styles.subtitle}>Preencha os dados para listar sua comunidade.</p>
        </header>

        <form className={styles.communityForm} onSubmit={handleSubmit}>
          {/* Seção de Upload */}
          <div className={styles.imageUploadSection}>
            <div 
              className={styles.uploadCircle} 
              onClick={() => fileInputRef.current?.click()}
            >
              {form.image ? (
                <img
                  src={URL.createObjectURL(form.image)}
                  alt="Preview"
                  className={styles.previewImage}
                />
              ) : (
                <div className={styles.uploadPlaceholder}>
                  <FaCamera className={styles.cameraIcon} />
                  <span>Logo</span>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className={styles.hiddenInput}
            />
            {form.image && (
              <button 
                type="button" 
                className={styles.changePhotoButton}
                onClick={() => fileInputRef.current?.click()}
              >
                Alterar Foto
              </button>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="name">Nome da Comunidade</label>
            <input
              id="name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Ex: MozDevs"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Descrição Curta</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              placeholder="Fale um pouco sobre o propósito..."
            />
          </div>

          <div className={styles.formGroup}>
            <label>Redes Sociais Disponíveis</label>
            <div className={styles.socialIconsPreview}>
              <FaInstagram /> <FaTelegram /> <FaLinkedinIn /> 
              <FaYoutube /> <FaGithub /> <FaWhatsapp /> 
              <FaTwitter /> <FaFacebookF />
            </div>
            <input
              type="text"
              name="socialLinks"
              value={form.socialLinks}
              onChange={handleChange}
              placeholder="Links separados por vírgula"
            />
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="contato@exemplo.com"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="website">Website</label>
              <input
                id="website"
                type="url"
                name="website"
                value={form.website}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
          </div>

          <button type="submit" className={styles.submitButton}>
            Criar Comunidade
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommunityModal;