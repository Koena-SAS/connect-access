type LocationState = {
  from: any;
};

function isLocationState(state: any): state is LocationState {
  return "from" in state;
}
export { isLocationState };
