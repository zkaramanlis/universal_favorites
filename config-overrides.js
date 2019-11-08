module.exports = {
    jest: config => {
        config.moduleNameMapper = Object.assign({}, config.moduleNameMapper, {
            "^dnd-core$": "dnd-core/dist/cjs",
            "^react-dnd$": "react-dnd/dist/cjs",
            "^react-dnd-html5-backend$": "react-dnd-html5-backend/dist/cjs",
            "^react-dnd-touch-backend$": "react-dnd-touch-backend/dist/cjs",
            "^react-dnd-test-backend$": "react-dnd-test-backend/dist/cjs",
            "^react-dnd-test-utils$": "react-dnd-test-utils/dist/cjs",
        });
        return config;
    },
};