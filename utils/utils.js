//function for Ip validation
const isValidIpv4Addr = (ip) => {
  return /^(?=\d+\.\d+\.\d+\.\d+$)(?:(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.?){4}$/.test(
    ip
  );
};

export { isValidIpv4Addr };
