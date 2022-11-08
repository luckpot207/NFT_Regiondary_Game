import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { Box, Pagination } from "@mui/material";

import { AppSelector } from "../../store";
import {
  filterAndPageState,
  updateFilterAndPageState,
} from "../../reducers/filterAndPage.reducer";

type Props = {
  totalCount: number;
};

const ItemPagination: React.FC<Props> = ({ totalCount }) => {
  const dispatch = useDispatch();
  const { pageSize, currentPage } = AppSelector(filterAndPageState);

  const handlePage = (event: React.ChangeEvent<unknown>, value: number) => {
    dispatch(updateFilterAndPageState({ currentPage: value }));
  };

  useEffect(() => {
    dispatch(updateFilterAndPageState({ currentPage: 1 }));
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
