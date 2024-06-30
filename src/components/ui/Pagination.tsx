import { colors } from "@/constants/colors";
import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handleClick = (page: number) => {
    onPageChange(page);
  };

  return (
    <div style={{ marginTop: "20px", textAlign: "center" }}>
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index}
          onClick={() => handleClick(index + 1)}
          style={{
            width: "50px",
            height: "50px",
            marginRight: "5px",
            marginBottom: "25px",
            padding: "5px 10px",
            backgroundColor: currentPage === index + 1 ? colors.primary : "transparent",
            color: currentPage === index + 1 ? "white" : "black",
            border: "1px solid blue",
            borderRadius: "25px",
            cursor: "pointer",
          }}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
};

export default Pagination;