import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';

const baseUrl = "http://localhost:3000"
const config = {
  headers: { 
    "Access-Control-Allow-Origin": "*",
    'Access-Control-Allow-Methods':'GET',
    'Content-Type': 'application/json'
  },
  mode: 'cors',
};

export const generateList = createAsyncThunk("baby/generateList", async () => {
    try {
      const res = await axios.get(baseUrl,config);
        const newList = await res.data;
        return newList.list_id;
    } catch (err) {
      console.log(err);
    }
});
export const fetchList = createAsyncThunk("users/fetchList", async (list_id) => {
  const response = await axios.get(baseUrl, {
    params: {
      list_id
    }
  });
  const listData = await response.data.baby_name_lists;
  return listData;
});

export const babyAdded = createAsyncThunk("users/babyAdded", async (payload) => {
  const response = await fetch(`${baseUrl}/addBaby`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  const listData = await response.json();
  console.log("ss",listData)
  if(listData.status !== 'error')
    return payload;
  else 
    return false;
});

const BabyListSlice = createSlice({
  name: "babyList",
  initialState: {
    listID: '',
    babies: [],
    loading: false,
    babyError: ''
  },
  reducers: {
    babyUpdated(state, action) {
      state.babies = [...action.payload];
    },
    babyUpdatedCross(state, action) {
      state.babies[action.payload.position].status = !state.babies[action.payload.position].status; 
    },
  },
  extraReducers: {
    [generateList.fulfilled]: (state, action) => {
        state.listID = action.payload;
    },
    [babyAdded.fulfilled]: (state, action) => {
      console.log('----------------', action)
      if(action.payload === false) {
        state.babyError = 'Duplicated';
      } else {
        state.babyError = '';
        state.babies = [...state.babies, {name: action.payload.babyName, status: true}];
      }
    },
    [babyAdded.rejected]: (state, action) => {
      console.log('-------re---------', action)
      state.babyError = 'Error';
    },

    [fetchList.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchList.fulfilled]: (state, action) => {
      state.loading = false;
      action.payload.forEach(baby => {
        state.babies.push({name: baby, status: true});
      });
    },
    [fetchList.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

export const { babyUpdated, babyUpdatedCross } = BabyListSlice.actions;

export default BabyListSlice.reducer;