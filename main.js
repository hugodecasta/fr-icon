import { br, button, create_elm, div, h3, input, span } from "./vanille/components.js"
import { groups } from "./groups.js"
import { marine_btn_bicon, marine_container, marine_icon, marine_icon_btn, marine_radio, marine_title, set_as_ncol } from "./marine-comps.js"
import { ICONS } from "./marine_icons.js"
import { listen_to } from "../vanille/components.js"
import { DATABASE } from "./vanille/db_sytem/database.js"

// --------------------------------------------------------- COMPONENTS

function search_bar(cb = () => { }) {

    function send() {
        cb(inp.value)
    }

    const inp = input('', 'search', () => { }).add_classe('fr-input').set_attributes({
        placeholder: "Nom ou partie du nom de l'icône ...",
        name: 'search'
    })

    inp.addEventListener('keydown', ({ key }) => {
        if (key == 'Enter') send()
    })

    return div('fr-search-bar').set_attributes({ role: 'search' }).add(
        create_elm('label').add_classe('fr-label').set_attributes({ for: 'search' }).add('Recherche icône'),
        inp,
        button('Recherche', send).set_attributes({ title: 'Recherche' }).add_classe('fr-btn')
    )
}

function icon_comp(i) {
    const icon = span().set_style({ textAlign: 'center' })
    function copy() {
        navigator.clipboard.writeText(
            {
                'name': i,
                'uname': i.replace(/-/g, '_'),
                'icon': 'ICONS.' + i.replace(/-/g, '_'),
            }[config.copy_type]
        )
    }
    listen_to(() => config.btn_type, () => {
        icon.clear()
        if (config.btn_type == 'filled') {
            icon.add(marine_icon_btn(i, copy, 'primary'))
        }
        if (config.btn_type == 'lite') {
            icon.add(marine_icon_btn(i, copy, 'tertiary'))
        }
        if (config.btn_type == 'btn') {
            icon.add(marine_btn_bicon('Button', i, copy))
        }
    }, true)
    return icon
}

function icons_table(name, icons) {
    icons = icons.slice(0, 49)
    return div().add(
        br().set_style({ marginTop: '30px' }),
        h3(name),
        set_as_ncol(icons.length ? 7 : 1, div().add(
            ...icons.map(i => icon_comp(i)),
            icons.length ? null : div().add('Aucun résultat').set_style({
                fontSize: '30px',
                opacity: 0.1
            })
        )).set_style({
            margin: '50px'
        }),
    )
}

// --------------------------------------------------------- SEARCH

function search_icon(pattern) {
    if (!pattern) return null_search()

    const filters = pattern.split(' ')
    const groups_found = Object.entries(groups).filter(([name]) => filters.map(f => name.includes(f)).reduce((a, b) => a && b, true)).map(a => a[0])
    console.log(filters, groups_found)
    const names = Object.values(ICONS).filter(n =>
        filters.map(f => n.includes(f)).reduce((a, b) => a && b, true) ||
        (groups_found.length && groups_found.map(g => groups[g].includes(n)).reduce((a, b) => a && b, true))
    )

    found.clear()
    found.add(
        icons_table('Résultats pour "' + pattern + '"...', names)
    )
}

function null_search() {
    found.clear()
    const rand_icons = Object.values(ICONS)
    rand_icons.sort(() => Math.random() - 0.5)
    icons_table('Quelques examples...', rand_icons.slice(0, 21)).add2(found)
}

// --------------------------------------------------------- MAIN

marine_container(marine_title('FR Design System - Icons', 'favicon.svg')).add2b()
marine_container(search_bar(search_icon)).add2b()

const config_db = new DATABASE('icon_config', {
    copy_type: 'name',
    theme: null,
    btn_type: 'filled',
})

const config = config_db.object
console.log(config)

if (config.theme == null) {
    config.theme = 'light'
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        config.theme = 'dark'
    }
}

div().add2b().fixed().add(
    set_as_ncol(3, marine_container()).add(
        marine_radio(
            'Copy type',
            {
                'Full name': 'name',
                '_ name': 'uname',
                '"ICONS.<icon_name>"': "icon"
            },
            config.copy_type,
            (type) => config.copy_type = type
        ),
        marine_radio(
            'Theme',
            {
                'Light': 'light',
                'Dark': 'dark'
            },
            config.theme,
            (t) => {
                document.documentElement.setAttribute('data-fr-theme', t)
                document.documentElement.setAttribute('data-fr-scheme', t)
                config.theme = t
            }
        ),
        marine_radio(
            'Button type',
            {
                'Filled': 'filled',
                'Lite': 'lite',
                'Button': 'btn',
            },
            config.btn_type,
            (t) => {
                config.btn_type = t
            }
        ),
    )
).set_style({
    width: '100%',
    left: '0px',
    bottom: '0px'
})

const found = marine_container().add2b()
null_search()

