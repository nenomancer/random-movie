<script lang="ts">
    import { currentMovie } from "../../lib/stores.ts";
</script>

<section id="disk">
    <div class="grip"></div>
    <div class="embed">
        <p>Nen-O-Vision Cartridge</p>
    </div>
    <div class="content">
        <div class="image">
            {#if $currentMovie.backdrop}
                <img src={$currentMovie.backdrop} alt="" />
            {/if}
            {#if !$currentMovie.backdrop}
                <p class="title">{$currentMovie.title.name}</p>
            {/if}
            <!-- <p>kurac</p> -->
        </div>
        <!-- <div class="title">
                <p>这是从市场买来的</p>
                <p class="bootleg-sticker">{$currentMovie.runtime} in 1</p>
            </div> -->
    </div>
</section>

<style lang="scss">
    @use "sass:color";
    @use "../../styles/variables";
    @use "../../styles/mixins";

    @import url("https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap");

    section {
        @include mixins.edge-bevel();
        grid-area: disk;
        background-color: variables.$monitor-color;
        transition: 250ms ease-out;
        width: 100%;
        height: 100%;
        display: flex;
        display: grid;
        grid-template-columns: 1fr 3fr;
        grid-template-rows: repeat(3, 1fr);
        grid-template-areas:
            "embed embed embed embed"
            "grip content content content"
            "grip content content content";
        transition-delay: 500ms !important;
        position: relative;

        @media screen and (max-width: 580px) {
            display: none;
        }
    }

    .content {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: stretch;
        grid-area: content;
    }

    .grip {
        grid-area: grip;
        background: linear-gradient(
            to bottom,
            variables.$monitor-color 70%,
            black
        );
        background-repeat: repeat-y;
        background-size: 100% 10px;
        margin-left: 0.25rem;
        margin-bottom: 0.25rem;
        margin-top: 1rem;
        &::before {
            @include mixins.edge-inset($size: 1px);

            content: "";
            position: absolute;
            inset: 0;
            left: 25%;
            top: 43.5%;
            right: 1rem;
            background: color.adjust(
                variables.$monitor-color,
                $lightness: -25%,
                $saturation: -10%
            );
            clip-path: rect(-100% 110% 100% -110%);
        }

        // &::after {
        //     @include mixins.edge-bevel($size: 1px);
        //     content: "";
        //     position: absolute;
        //     left: 25%;
        //     top: 70%;
        //     bottom: 12.5%;
        //     right: 1rem;
        //     z-index: 2;
        //     right: 1rem;
        //     background-color: variables.$monitor-color;
        // }
    }

    .image {
        @include mixins.edge-bevel($size: 1px);

        $color: color.adjust(
            variables.$monitor-color,
            $lightness: -50%,
            $saturation: -15%
        );
        padding: 0.75rem;
        background: $color;
        height: 100%;
        margin-right: 1rem;
        margin-top: 1.5rem;
        transition: 250ms ease-out;
        transition-delay: 0 !important;
        z-index: 1;
        position: relative;

        &::before {
            @include mixins.edge-inset($size: 0.5px, $opacity: 0.3);
            content: "";
            position: absolute;
            inset: 0;
            inset: 0.6rem;
            bottom: 1.85rem;
            border-radius: 0.1rem;
        }

        &::after {
            content: "Nenomancer Cartridge";
            @include mixins.text-bevel($color: $color);
            color: $color;
            background-color: inherit;
            position: absolute;
            bottom: 0.8rem;
            inset-inline: 1rem;
            border-radius: 1rem;
            border-top-left-radius: 0;
            border-top-right-radius: 0;
            text-align: center;
            font-weight: bold;
            line-height: 1;
            font-size: 0.5rem;
            padding-bottom: 0.1rem;
            text-transform: uppercase;
            text-wrap: nowrap;
            box-shadow:
                0 2.5px 1px 0 rgba(0, 0, 0, 0.75),
                0 3px 1px 0 rgba(255, 255, 255, 0.6);
        }
        img {
            width: 100%;
            object-fit: contain;
            border-radius: 0.15rem;
            box-shadow:
                -0.66px -0.5px 0 -0.25px rgba(white, 0.35),
                0.75px 0.75px 0.5px -0.25px rgba(black, 0.8);
            rotate: 0.75deg; // maybe randomize?
        }
    }

    .title {
        // padding: 2rem;
        text-align: center;
        background-color: rgb(228, 228, 228);
        box-shadow: inset 0 0 0 0.25rem darkblue;
        position: absolute;
        inset: 0.75rem;
        bottom: 2rem;
        border-radius: 0.15rem;
        color: darkblue;
        font-family: "Caveat";
        text-transform: uppercase;
        font-size: 0.75rem;
        font-weight: 700;
        line-height: 1;
        display: flex;
        align-items: center;
        padding-inline: 1rem;
        rotate: -0.75deg; // maybe randomize?
    }
    .embed {
        @include mixins.text-inset();
        padding: 1rem;
        text-transform: uppercase;
        grid-area: embed;
    }
</style>
