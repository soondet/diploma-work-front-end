export const sectionDiv = (props) =>
  StyleSheet.create({
    section: {
        display: "grid",
        gridTemplateColumns: "repeat(props, 1fr)",
        gridGap: "10px"
    },
    div:{
        height: "30px",
        border: "1px solid #000",
    },
  });
