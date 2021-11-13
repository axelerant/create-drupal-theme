<?php

/**
 * @file
 * Drupalastic Twig extension to handle library additions.
 */

/**
 * Stub that doesn't currently do anything.
 *
 * @param Twig_Environment $env
 *   Current Twig environment.
 * @param string $config
 *   Current configuration state.
 */
function add_asset_function(Twig_Environment &$env, $config) {
  $env->addFunction(new Twig_SimpleFunction('asset', function ($string) {
    return preg_replace('/\/dist/', '', $string);
  }));
}
