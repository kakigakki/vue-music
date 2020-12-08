import { mapGetters, mapActions } from "vuex"


export const playerMixin = {
    created() {
        this.MINI_PLAYER_HEIGHT = 60
    },
    computed: {
        ...mapGetters([
            "getPlaylist"
        ])
    },
    mounted() {
        this.bottomPlayer()
    },
    activated() {
        this.bottomPlayer()
    },
    watch: {
        getPlaylist() {
            this.bottomPlayer()
        }
    },
    methods: {
        //让底部的播放器适配
        bottomPlayer() {
            throw new Error("should implement bottomPlayer method")
        }
    },

}