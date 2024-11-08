import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { ChevronLeft } from "@mui/icons-material";
import { FaTimes } from "react-icons/fa";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import styled from "@emotion/styled";

const CustomSelect = styled.select`
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  appearance: none;
  background: white;
  cursor: pointer;
  min-width: 120px;
  &:focus {
    outline: none;
    border-color: #3f51b5;
  }
`;

const CustomOption = styled.option`
  padding: 8px;
  background: white;
  &:hover {
    background: #f1f1f1;
  }
`;

const SortColumns = ({
  columns,
  setSort,
  fields,
  setFields,
  handleUpdateColumns,
}) => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const [availableFields, setAvailableFields] = useState(
    columns?.result?.columns.map((col) => col.name)
  );
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [draggedField, setDraggedField] = useState(null);
  const [nameField, setNameField] = useState("");
  const handleAddField = () => {
    setFields([...fields, { field: "", order: "" }]);
  };

  const handleRemoveField = (index) => {
    const newFields = fields.filter((_, i) => i !== index);
    const removedField = fields[index].field;
    setFields(newFields);
    setAvailableFields([...availableFields, removedField]);
  };

  const handleFieldChange = (index, field) => {
    const newFields = [...fields];
    newFields[index].field = field;
    setFields(newFields);
    setNameField(field);
  };

  const handleOrderChange = (index, order) => {
    const newFields = [...fields];
    newFields[index].order = order;
    setFields(newFields);
    handleUpdateColumns(order, nameField);
  };

  const moveField = (dragIndex, hoverIndex) => {
    const dragField = fields[dragIndex];
    const newFields = [...fields];
    newFields.splice(dragIndex, 1);
    newFields.splice(hoverIndex, 0, dragField);
    setFields(newFields);
  };

  const FieldItem = ({ field, index }) => {
    const ref = useRef(null);
    const [, drop] = useDrop({
      accept: "field",
      hover(item, monitor) {
        if (!ref.current) {
          return;
        }
        const dragIndex = item.index;
        const hoverIndex = index;
        if (dragIndex === hoverIndex) {
          return;
        }
        const hoverBoundingRect = ref.current?.getBoundingClientRect();
        const hoverMiddleY =
          (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        const clientOffset = monitor.getClientOffset();
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
          return;
        }
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
          return;
        }
        setDraggedField(field.field);
        moveField(dragIndex, hoverIndex);
        item.index = hoverIndex;
      },
    });

    const [{ isDragging }, drag] = useDrag({
      type: "field",
      item: { index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: () => setDraggedIndex(null),
    });

    useEffect(() => {
      if (isDragging && index === draggedIndex) {
        setDraggedIndex(index);
      }
    }, [isDragging, index]);

    drag(drop(ref));

    return (
      <Box
        ref={ref}
        sx={{
          display: "flex",
          flexDirection: isSmallScreen ? "column" : "row",
          alignItems: "center",
          gap: "10px",
          cursor: "grab",
          boxShadow:
            draggedIndex || draggedField !== field.field
              ? "0 4px 8px rgba(0, 0, 0, 0.2)"
              : "none",
          padding: "5px",
          borderRadius: "4px",
        }}
      >
        <IconButton onClick={() => handleRemoveField(index)}>
          <FaTimes
            style={{
              color: "red",
              fontSize: "14px",
            }}
          />
        </IconButton>
        <CustomSelect
          name={field.field}
          id={field.field}
          aria-label="Field"
          defaultValue={field.field}
          value={field.field}
          onChange={(e) => handleFieldChange(index, e.target.value)}
          style={{
            padding: "5px",
            width: isSmallScreen ? "100%" : "200px",
          }}
        >
          <CustomOption value="" disabled>
            Select Field
          </CustomOption>
          {availableFields?.map((nameIndex) => {
            if (
              nameIndex === "profile" ||
              nameIndex === "company" ||
              nameIndex === "owner" ||
              nameIndex === "assignedTo" ||
              nameIndex === "updatedFromLinkedin"
            )
              return (
                <CustomOption
                  key={nameIndex}
                  value={nameIndex}
                  disabled={fields.some((f) => f.field === nameIndex)}
                  style={{
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  {nameIndex}
                </CustomOption>
              );
          })}
        </CustomSelect>
        <Box display="flex" flexDirection="row" alignItems="center" gap="5px">
          <IconButton
            onClick={() => handleOrderChange(index, "AS")}
            disabled={!field.field}
            style={{
              border: "1px solid #e7e9ea",
              borderRadius: "4px",
              padding: "2px 10px",
              backgroundColor: field.order === "AS" ? "#6a69ff" : "#fff",
            }}
          >
            <span
              style={{
                fontSize: "12px",
                color: field.order === "AS" ? "#fff" : "#414c58",
                fontWeight: 500,
              }}
            >
              Ascending
            </span>
          </IconButton>
          <IconButton
            onClick={() => handleOrderChange(index, "DS")}
            disabled={!field.field}
            style={{
              border: "1px solid #e7e9ea",
              borderRadius: "4px",
              padding: "2px 10px",
              backgroundColor: field.order === "DS" ? "#6a69ff" : "#fff",
            }}
          >
            <span
              style={{
                fontSize: "12px",
                color: field.order === "DS" ? "#fff" : "#414c58",
                fontWeight: 500,
              }}
            >
              Descending
            </span>
          </IconButton>
        </Box>
      </Box>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          padding: "10px",
          width: isSmallScreen ? "200px" : "500px",
          maxWidth: "500px",
        }}
      >
        <Typography
          gutterBottom
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            fontSize: "14px",
          }}
        >
          <ChevronLeft
            onClick={() => {
              setSort(false);
            }}
            style={{ cursor: "pointer" }}
          />
          Sort Columns
        </Typography>
        <Divider />
        {fields &&
          fields.map((field, index) => (
            <FieldItem key={index} field={field} index={index} />
          ))}
        {fields.length > 0 && <Divider />}
        <Box>
          <Button
            variant="contained"
            onClick={handleAddField}
            style={{
              backgroundColor: "transparent",
              border: "1px solid #ccc",
              color: "black",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
              marginBottom: "0px",
            }}
          >
            + Add Field
          </Button>
        </Box>
      </Box>
    </DndProvider>
  );
};

export default SortColumns;
