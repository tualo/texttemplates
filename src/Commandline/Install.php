<?php

namespace Tualo\Office\TextTemplates\Commandline;

use Tualo\Office\Basic\ICommandline;
use Tualo\Office\Basic\CommandLineInstallSQL;

class Install extends CommandLineInstallSQL  implements ICommandline
{
    public static function getDir(): string
    {
        return dirname(__DIR__, 1);
    }
    public static $shortName  = 'texttemplates';
    public static $files = [
        'texttemplate_klassen' => 'setup texttemplate_klassen',
        'texttemplate' => 'setup texttemplate',

        'texttemplate_klassen.ds' => 'setup ds texttemplate_klassen',
        'texttemplate.ds' => 'setup ds texttemplate',


    ];
}
