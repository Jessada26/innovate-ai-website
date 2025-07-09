import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";
import {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
  logoutApi,
} from "@/src/api/api-client";
import {
  IBooks,
  ICreateBookDto,
  IUpdateBookDto,
} from "@/src/api/api-interface";
import MenuLogo from "@/src/api/components/menuLogo";
import {
  Box,
  Button,
  Modal,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const BookPage = () => {
  const router = useRouter();
  const [books, setBooks] = useState<IBooks[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<ICreateBookDto>({
    title: "",
    author: "",
    genre: "",
    publishedYear: undefined,
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [openAlert, setOpenAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState<string>("");
  const [totalCount, setTotalCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const fetchBooks = async () => {
    try {
      const res = await getBooks(
        paginationModel.page + 1,
        paginationModel.pageSize
      );
      setBooks(res.data);
      setTotalCount(res.total);
    } catch {
      setMessageAlert("Failed to load books");
      setOpenAlert(true);
    }
  };

  useEffect(() => {
    if (!getCookie("access_token")) {
      router.push("/");
    } else {
      fetchBooks();
    }
  }, [paginationModel]);

  const handleOpenCreate = () => {
    setForm({ title: "", author: "", genre: "", publishedYear: undefined });
    setEditMode(false);
    setEditId(null);
    setOpenModal(true);
  };

  const handleOpenEdit = (book: IBooks) => {
    setForm({
      title: book.title,
      author: book.author,
      genre: book.genre,
      publishedYear: Number(book.publishedYear),
    });
    setEditMode(true);
    setEditId(book.id);
    setOpenModal(true);
  };

  const handleSave = async () => {
    try {
      if (editMode && editId) {
        await updateBook(editId, form as IUpdateBookDto);
      } else {
        await createBook(form);
      }
      setOpenModal(false);
      fetchBooks();
    } catch {
      setMessageAlert("Failed to save book");
      setOpenAlert(true);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBook(id);
      fetchBooks();
    } catch {
      setMessageAlert("Failed to delete book");
      setOpenAlert(true);
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 200 },
    { field: "title", headerName: "Title", width: 150 },
    { field: "author", headerName: "Author", width: 150 },
    { field: "genre", headerName: "Genre", width: 100 },
    { field: "publishedYear", headerName: "Year", width: 100 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <>
          <Button onClick={() => handleOpenEdit(params.row)}>Edit</Button>
          <Button color="error" onClick={() => handleDelete(params.row.id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  const logout = async () => {
    try {
      await logoutApi();
      if (!getCookie("access_token")) {
        router.push("/");
      }
    } catch (err) {
      setMessageAlert("logout");
      setOpenAlert(true);
    }
  };

  return (
    <div className="container">
      <div className="h-element">
        <MenuLogo />
        <div className="menu-logout" onClick={logout}>
          logout
        </div>
      </div>
      <div className="body">
        <div className="portfolio-dashboard">
          <Typography variant="h4" gutterBottom style={{ marginTop: 46 }}>
            Book Page
          </Typography>
          <Button variant="contained" onClick={handleOpenCreate}>
            Add Book
          </Button>
          <Box mt={2}>
            <DataGrid
              rows={books}
              columns={columns}
              getRowId={(row) => row.id}
              autoHeight
              pagination
              paginationMode="server"
              rowCount={totalCount}
              paginationModel={paginationModel}
              onPaginationModelChange={(model) => {
                if (model.pageSize !== paginationModel.pageSize) {
                  setPaginationModel({ page: 0, pageSize: model.pageSize });
                } else {
                  setPaginationModel(model);
                }
              }}
              pageSizeOptions={[1, 10, 20]}
            />
          </Box>
          <Modal open={openModal} onClose={() => setOpenModal(false)}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <TextField
                label="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <TextField
                label="Author"
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
              />
              <TextField
                label="Genre"
                value={form.genre}
                onChange={(e) => setForm({ ...form, genre: e.target.value })}
              />
              <TextField
                label="Published Year"
                type="number"
                value={form.publishedYear || ""}
                onChange={(e) =>
                  setForm({ ...form, publishedYear: Number(e.target.value) })
                }
              />
              <Button variant="contained" onClick={handleSave}>
                {editMode ? "Update" : "Create"}
              </Button>
            </Box>
          </Modal>
          <Snackbar
            open={openAlert}
            autoHideDuration={4000}
            onClose={() => setOpenAlert(false)}
          >
            <MuiAlert severity="error" elevation={6} variant="filled">
              {messageAlert}
            </MuiAlert>
          </Snackbar>
        </div>
      </div>
    </div>
  );
};

export default BookPage;
