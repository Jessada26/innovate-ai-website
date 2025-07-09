import React, { useState, useEffect } from "react";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";
import MenuLogo from "@/src/api/components/menuLogo";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { IGetExchangeRateUsdApi } from "@/src/api/api-partty/interface";
import {
  logoutApi,
  getCmcTopRankApi,
  getProfileApi,
  updateUserCoinsApi,
} from "@/src/api/api-client";
import { getExchangeRateUsdApi } from "@/src/api/api-partty";
import Button from "@mui/material/Button";
import {
  IDataCmcTopRankApi,
  IGetProfileApi,
  IMergeUserData,
  IUpdateUserCoinsApi,
} from "@/src/api/api-interface";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const URL_ICON_COIN_CMC = `${process.env.URL_ICON_COIN_CMC}`;

interface IMergeRows<T> {
  id: number;
  icon: string;
  name: string;
  price: number;
  rank: number;
  favor: boolean;
  amount: number;
  profit: number;
  userData: T; 
}

const Portfolio: React.FC = () => {
  const [rowsCoinTable, setRowsCoinTable] = useState<IMergeRows<IMergeUserData>[]>([]);
  const [cmcTopRank, setCmcTopRank] = useState<IDataCmcTopRankApi[]>([]);
  const [openAlert, setOpenAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState<string>("");
  const [exchangerateInThb, setExchangerateInThb] = useState<number>(35);
  const [userProfile, setUserProfile] = useState<IGetProfileApi | null>(null);
  const [sumBalance, setSumBalance] = useState<number>(0);
  const router = useRouter();
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70, type: "number" },
    { field: "rank", headerName: "rank", width: 60, type: "number" },
    {
      field: "icon",
      headerName: "icon",
      width: 80,
      renderCell: (cell) => (
        <ListItemAvatar>
          <Avatar src={`${cell.value}`} />
        </ListItemAvatar>
      ),
    },
    { field: "name", headerName: "name", width: 120 },
    {
      field: "amount",
      headerName: "amount coin",
      type: "number",
      width: 90,
      valueFormatter: (params) =>
        params.value ? parseFloat(params.value).toFixed(2) : 0,
    },
    {
      field: "price",
      headerName: "price (Baht)",
      type: "number",
      width: 140,
      valueFormatter: (params) =>
        params.value ? parseFloat(params.value).toFixed(8) : 0,
    },
    {
      field: "profit",
      headerName: "profit (Baht)",
      type: "number",
      width: 150,
      valueFormatter: (params) =>
        params.value ? parseFloat(params.value).toFixed(2) : 0,
    },
    {
      field: "favor",
      headerName: "favor coin",
      type: "boolean",
      width: 130,
      renderCell: (params: GridRenderCellParams) => (
        <span style={{ color: params.value ? "green" : "red" }}>
          {params.value ? "Favor" : "Not Favor"}
        </span>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Button
          variant="outlined"
          color="primary"
          onClick={() => handleEditButtonClick(params.row.id)}
        >
          Edit
        </Button>
      ),
    },
  ];

  const fetchCmcTopRank = async () => {
    try {
      const dataCmcTopRank = (await getCmcTopRankApi()) as IDataCmcTopRankApi[];
      setCmcTopRank(dataCmcTopRank);
    } catch {
      setMessageAlert("fetch Cmc Top Rank");
      setOpenAlert(true);
    }
  };

  const fetchExchangerateUsd = async () => {
    try {
      const dataExchangerateUsd =
        (await getExchangeRateUsdApi()) as IGetExchangeRateUsdApi;
      setExchangerateInThb(dataExchangerateUsd.conversion_rates.THB);
    } catch {
      setMessageAlert("fetch Exchangerate Usd");
      setOpenAlert(true);
    }
  };

  const mergeRows = async () => {
    const result = mergeUserData.map((coinItem: IMergeUserData) => {
      const priceUsdToThb = coinItem.quote.USD.price * exchangerateInThb;
      const profitCoinToThb =
        coinItem.quote.USD.price * coinItem.amount * exchangerateInThb;
      return {
        id: coinItem.id,
        icon: `${URL_ICON_COIN_CMC}/${coinItem.id}.png`,
        name: coinItem.name,
        price: priceUsdToThb,
        rank: coinItem.cmc_rank,
        favor: coinItem.favor,
        profit: profitCoinToThb,
        amount: coinItem.amount,
      };
    }) as IMergeRows<IMergeUserData>[];
    setSumBalance(result.reduce((acc, item) => acc + item.profit, 0));
    setRowsCoinTable(result);
  };

  useEffect(() => {
    if (userProfile) {
      mergeRows();
    }
  }, [cmcTopRank]);

  const mergeUserData = cmcTopRank.map((coinItem: IDataCmcTopRankApi) => {
    const isUserFarvorCoin = userProfile?.favorCoin.some(
      (userFavorCoin) => userFavorCoin.currencyId === coinItem.id
    );

    const findAmountThisCoin = userProfile?.coin.find(
      (userAmountThisCoin) => userAmountThisCoin.currencyId === coinItem.id
    );

    return {
      ...coinItem,
      favor: !!isUserFarvorCoin,
      amount: !!findAmountThisCoin ? findAmountThisCoin.amount : 0,
    };
  });

  const handleCloseAlert = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlert(false);
  };

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

  useEffect(() => {
    if (!getCookie("access_token")) {
      router.push("/");
    } else {
      profile();
    }
  }, [getCookie("access_token")]);

  useEffect(() => {
    if (userProfile) {
      mergeRows();
    }
  }, [userProfile]);

  useEffect(() => {
    // Fetch data immediately when component mounts
    fetchCmcTopRank();

    // Set up interval to fetch data every 10 seconds
    const fetchDataInterval = setInterval(() => {
      fetchCmcTopRank();
      //fetchExchangerateUsd();
    }, 10000);

    // Cleanup interval on component unmount
    return () => {
      clearInterval(fetchDataInterval);
    };
  }, []);

  const profile = async () => {
    try {
      const user = await getProfileApi();
      if (user) {
        setUserProfile(user);
      }
    } catch {
      setUserProfile(null);
      router.push("/");
    }
  };

  const [openModal, setOpenModal] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [favor, setFavor] = useState<boolean>(false);

  const handleEditButtonClick = (rowId: number) => {
    const getDataBeforeEdit = rowsCoinTable.find(
      (item) => item.id === rowId
    ) as IMergeRows<IMergeUserData>;
    if (!getDataBeforeEdit) {
      setOpenModal(false);
      return;
    }
    setAmount(getDataBeforeEdit.amount);
    setFavor(getDataBeforeEdit.favor);
    setSelectedRowId(rowId);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedRowId(null);
    setFavor(false);
    setAmount(0);
  };

  const updateUserCoin = async (
    currencyFavor: boolean,
    currencyAmount: number,
    currencyIdWhenUpdate: number
  ) => {
    try {
      const buildUpdateUserCoinPlayLoad = {
        id: userProfile?.id,
        coin: userProfile?.coin,
        favorCoin: userProfile?.favorCoin,
      } as IUpdateUserCoinsApi;

      //------favor generate
      const oldUserFavorCoins = userProfile?.favorCoin;
      if (oldUserFavorCoins) {
        if (!currencyFavor) {
          buildUpdateUserCoinPlayLoad.favorCoin = oldUserFavorCoins?.filter(
            (oldUserFavorCoinItem) =>
              oldUserFavorCoinItem.currencyId !== currencyIdWhenUpdate
          );
        } else {
          if (
            !oldUserFavorCoins?.find(
              (oldUserFavorCoinItem) =>
                oldUserFavorCoinItem.currencyId === currencyIdWhenUpdate
            )
          )
            buildUpdateUserCoinPlayLoad.favorCoin.push({
              currencyId: currencyIdWhenUpdate,
            });
        }
      }
      //-------end favor
      //------Amount generate
      const oldUserCoins = userProfile?.coin;
      const comingAmountCoins = {
        currencyId: currencyIdWhenUpdate,
        amount: currencyAmount,
      };
      if (oldUserCoins) {
        buildUpdateUserCoinPlayLoad.coin = oldUserCoins?.reduce(
          (acc, currentItem) => {
            const existingItemIndex = acc.findIndex(
              (item) => item.currencyId === currentItem.currencyId
            );

            if (existingItemIndex !== -1) {
              // Replace the existing item
              acc[existingItemIndex] = comingAmountCoins;
            } else {
              // Add the new item
              acc.push(currentItem);
            }
            return acc;
          },
          [comingAmountCoins]
        );
      }
      //------Amount
      await updateUserCoinsApi(buildUpdateUserCoinPlayLoad);
      await profile();
    } catch {
      setMessageAlert("update user coins");
      setOpenAlert(true);
    }
  };

  const handleSaveChanges = async () => {
    if (selectedRowId) await updateUserCoin(favor, amount, selectedRowId);
    handleCloseModal();
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
          <div className="balance">
            Your balance: {sumBalance.toFixed(2)} Baht
          </div>
          <div className="portfolio-table">
            <DataGrid
              sx={{
                display: "block",
                margin: "auto",
                color: "white",
                height: 640,
                width: "100%",
                maxWidth: "1000px",
                "& .cold": {
                  backgroundColor: "#b9d5ff91",
                  color: "#1a3e72",
                },
                "& .hot": {
                  backgroundColor: "#ff943975",
                  color: "#1a3e72",
                },
              }}
              rows={rowsCoinTable}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[5, 10]}
              checkboxSelection={false}
            />
          </div>
        </div>
      </div>
      <Snackbar
        open={openAlert}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
      >
        <Alert severity="error">Fail {messageAlert} pls try agian!</Alert>
      </Snackbar>

      <Modal
        className="modal-edit-coin"
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            maxWidth: 400,
          }}
        >
          <TextField
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            fullWidth
            margin="normal"
            inputProps={{
              step: "any",
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={favor}
                onChange={(e) => setFavor(e.target.checked)}
              />
            }
            label="Favor"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveChanges}
          >
            Save Changes
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default Portfolio;
