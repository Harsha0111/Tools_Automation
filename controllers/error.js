const errorPage = (res, error) => {
  res.render("error", { error: error });
};

export { errorPage };
