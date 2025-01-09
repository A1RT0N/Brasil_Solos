import React from "react";
import ButtonsModal from "../ButtonsModal";

const YesOrNoModal = ({ title, paragraph, handleYes, handleCancel, onClose }) => {
  return (
    <ButtonsModal
      title={title}
      paragraph={paragraph}
      buttonsText={["Sim", "Cancelar"]}
      handleButtons={[handleYes, handleCancel]}
      onClose={onClose}
    />
  );
};

export default YesOrNoModal;
