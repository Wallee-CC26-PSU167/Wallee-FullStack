export const up = (pgm) => {
  pgm.createTable("users", {
    id_user: {
      type: "varchar(10)",
      primaryKey: true,
    },
    nama: {
      type: "varchar(100)",
    },
    email: {
      type: "varchar(100)",
      unique: true,
    },
    password: {
      type: "text",
    },
    created_at: {
      type: "timestamp",
      default: pgm.func("current_timestamp"),
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable("users");
};