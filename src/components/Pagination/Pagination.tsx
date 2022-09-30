import { Box, Button, Pagination } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { gameState, updateState } from "../../reducers/cryptolegions.reducer";
import { AppSelector } from "../../store";

type Props = {
  totalCount: number;
};

const ItemPagination: React.FC<Props> = ({ totalCount }) => {
  const dispatch = useDispatch();
  const { pageSize, currentPage } = AppSelector(gameState);

  const handlePage = (event: React.ChangeEvent<unknown>, value: number) => {
    dispatch(updateState({ currentPage: value }));
  };

  useEffect(() => {
    dispatch(updateState({ currentPage: 1 }));
  }, []);

  return (
    <Box>
      <Pagination
        count={Math.ceil(totalCount / Number(pageSize))}
        showFirstButton
        showLastButton
        color="primary"
        page={currentPage.valueOf()}
        onChange={handlePage}
      />
    </Box>
  );
};

export default ItemPagination;
